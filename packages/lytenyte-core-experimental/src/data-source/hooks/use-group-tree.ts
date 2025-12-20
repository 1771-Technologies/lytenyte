import type { GroupFn, GroupIdFn, RowGroup, RowLeaf } from "@1771technologies/lytenyte-shared";
import { useMemo, useRef } from "react";

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
    __isLast: boolean;
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
  group: GroupFn<T> | undefined,
  groupIdFn: GroupIdFn,
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
              __isLast: isLast,
              kind: "branch",
              id: groupId,
              data: null as any,
              depth: j,
              key: p,
            });
          const node = groupNodeCacheRef.current.get(groupId)!;

          node.__children = children;
          node.__isLast = isLast;

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

    return root;
  }, [group, groupIdFn, leafs, workingSet]);
}
