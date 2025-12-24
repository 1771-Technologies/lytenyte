import type {
  AggregationFn,
  GroupFn,
  GroupIdFn,
  RowGroup,
  RowLeaf,
  Writable,
} from "@1771technologies/lytenyte-shared";
import { useMemo, useRef } from "react";
import { collapse } from "./collapse.js";
import { collapseLast } from "./collapse-last.js";
import type { HavingFilterFn } from "../../use-client-data-source.js";

export interface RootNode<T> {
  readonly kind: "root";
  readonly children: RootMap<T>;
  readonly groupLookup: Map<string, GroupNode<T>>;
  readonly maxDepth: number;
}

export interface LeafNode<T> {
  readonly parent: GroupNode<T> | RootNode<T>;
  readonly kind: "leaf";
  readonly key: string | null | number;
  readonly row: RowLeaf<T>;
}

export interface GroupNode<T> {
  readonly kind: "branch";
  readonly id: string;
  readonly row: RowGroup & {
    __children: Map<string | null | number, GroupNode<T> | LeafNode<T>>;
    __invalidate: boolean;
  };
  readonly last: boolean;
  readonly key: string | null | number;
  readonly children: Map<string | null | number, GroupNode<T> | LeafNode<T>>;
  readonly path: (string | null)[];
  readonly leafs: number[];
  readonly leafIds: Set<string>;
  readonly parent: GroupNode<T> | RootNode<T>;
}

export type RootMap<T> = Map<string | null | number, GroupNode<T> | LeafNode<T>>;

export function useGroupTree<T>(
  leafs: RowLeaf<T>[],
  workingSet: number[],
  group: GroupFn<T> | undefined | null,
  groupIdFn: GroupIdFn,
  rowGroupCollapseBehavior: "no-collapse" | "last-only" | "full-tree",
  having: HavingFilterFn | HavingFilterFn[] | null | undefined,
  havingGroupAlways: boolean,
  agg: AggregationFn<T> | undefined | null,
) {
  const groupNodeCacheRef = useRef(new Map<string, GroupNode<T>["row"]>());
  return useMemo(() => {
    const groupIdToGroupNode: Map<string, GroupNode<T>> = new Map();

    if (!group) return null;

    const root: RootNode<T> = {
      kind: "root",
      children: new Map(),
      groupLookup: groupIdToGroupNode,
      maxDepth: 0,
    };

    for (let i = 0; i < workingSet.length; i++) {
      const n = leafs[workingSet[i]];
      const paths = group(n);

      let current = root.children;
      let currentGroup: GroupNode<T> | RootNode<T> = root;

      // This has been marked a non-terminal node
      if (!paths?.length) {
        current.set(current.size, { kind: "leaf", row: n, parent: root, key: current.size });
        continue;
      }

      (root as any).maxDepth = Math.max(paths.length, root.maxDepth);

      for (let j = 0; j < paths.length; j++) {
        const p = paths[j];
        if (!current.has(p)) {
          const partial = paths.slice(0, j + 1);
          const groupId = groupIdFn(partial);

          const children = new Map<string | number | null, GroupNode<T> | LeafNode<T>>();
          const isLast = j === paths.length - 1;

          if (!groupNodeCacheRef.current.get(groupId))
            groupNodeCacheRef.current.set(groupId, {
              __children: children,
              __invalidate: true,
              last: isLast,
              kind: "branch",
              id: groupId,
              data: null as any,
              depth: j,
              key: p,
            });
          const node = groupNodeCacheRef.current.get(groupId)!;

          node.__children = children;
          node.__invalidate = true;
          (node as Writable<RowGroup>).last = isLast;

          current.set(p, {
            id: groupId,
            row: node,
            kind: "branch",
            children,
            leafs: [],
            leafIds: new Set(),
            path: partial,
            last: j === paths.length - 1,
            parent: currentGroup,
            key: p,
          });

          groupIdToGroupNode.set(groupId, current.get(p)! as GroupNode<T>);
        }

        const node = current.get(p)!;
        if (node.kind !== "branch") {
          console.error(
            `Invalid grouping path. Expected a group node for path: ${paths}, but found a leaf along the way.`,
            node,
          );
          continue;
        }
        node.leafs.push(i);
        node.leafIds.add(n.id);
        currentGroup = node;
        current = node.children;
      }

      current.set(current.size, { kind: "leaf", row: n, parent: currentGroup, key: current.size });
    }

    // Doing filtering here. Then I can collapse afterwards
    // TODO: @lee verify this logic is sound and test thoroughly
    if (having) {
      const traverse = (node: RootNode<T> | GroupNode<T> | LeafNode<T>, depth: number = 0) => {
        if (node.kind === "leaf") return;
        if (node.kind === "root") node.children.forEach((c) => traverse(c, 0));

        const filterFn = Array.isArray(having)
          ? (having[depth] ?? (havingGroupAlways ? having.at(-1) : null))
          : having;
        if (!filterFn) return;

        if (node.kind === "branch") {
          const row = node.row;
          if (row.__invalidate) {
            const data = agg ? agg(node.leafs.map((i) => leafs[workingSet[i]])) : {};
            (row as Writable<RowGroup>).data = data;
            row.__invalidate = false;
          }

          const shouldKeep = filterFn(row);
          if (shouldKeep) {
            node.children.forEach((c) => traverse(c, depth + 1));
          } else {
            // This node is definitely being deleted, so let's get rid of it.
            root.groupLookup.delete(node.id);
            if (node.parent.kind === "root") {
              node.parent.children.delete(node.key);
            } else {
              let current: GroupNode<T> | RootNode<T> = node;
              while (current.kind !== "root") {
                // Remove the node from itself
                current.parent.children.delete(current.key);

                // The parent still has more children, so we should keep them and move on.
                if (current.parent.children.size) break;
                current = current.parent;
              }
            }
          }
        }
      };

      traverse(root, 0);
    }

    if (rowGroupCollapseBehavior === "full-tree") root.children.forEach(collapse);
    if (rowGroupCollapseBehavior === "last-only") root.children.forEach(collapseLast);

    return root;
  }, [agg, group, groupIdFn, having, havingGroupAlways, leafs, rowGroupCollapseBehavior, workingSet]);
}
