import type { GroupFn, RowLeaf } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export interface RootNode<T> {
  readonly kind: "root";
  readonly children: RootMap<T>;
}

export interface LeafNode<T> {
  readonly parent: GroupNode<T> | RootNode<T>;
  readonly kind: "leaf";
  readonly key: string | null | number;
  readonly row: RowLeaf<T>;
}

export interface GroupNode<T> {
  readonly kind: "branch";
  readonly row: -1;
  readonly last: boolean;
  readonly key: string | null | number;
  readonly children: Map<string | null | number, GroupNode<T> | LeafNode<T>>;
  readonly path: (string | null)[];
  readonly leafs: number[];
  readonly parent: GroupNode<T> | RootNode<T>;
}

export type RootMap<T> = Map<string | null | number, GroupNode<T> | LeafNode<T>>;

export function useGroupTree<T>(leafs: RowLeaf<T>[], workingSet: number[], group: GroupFn<T> | undefined) {
  return useMemo(() => {
    if (!group) return null;

    const root: RootNode<T> = { kind: "root", children: new Map() };

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

      for (let j = 0; j < paths.length; j++) {
        const p = paths[j];
        if (!current.has(p))
          current.set(p, {
            kind: "branch",
            children: new Map(),
            leafs: [],
            path: paths.slice(0, j + 1),
            row: -1,
            last: j === paths.length - 1,
            parent: currentGroup,
            key: p,
          });

        const node = current.get(p)!;
        if (node.kind !== "branch") {
          console.error(
            `Invalid grouping path. Expected a group node for path: ${paths}, but found a leaf along the way.`,
            node,
          );
          continue;
        }
        node.leafs.push(i);
        currentGroup = node;
        current = node.children;
      }

      current.set(current.size, { kind: "leaf", row: n, parent: currentGroup, key: current.size });
    }

    return root;
  }, [group, leafs, workingSet]);
}
