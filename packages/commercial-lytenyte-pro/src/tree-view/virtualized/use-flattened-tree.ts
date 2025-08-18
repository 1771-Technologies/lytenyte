import {
  computePathTree,
  type PathBranch,
  type PathLeaf,
  type PathProvidedItem,
} from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export function useFlattenedTree<T extends PathProvidedItem>(
  paths: T[],
  expansions: Record<string, boolean>,
  expansionDefault: boolean,
  nonAdjacentPathTrees?: boolean,
) {
  const { flat, nodeToIndex, indexToId, allIds, idToNode, root } = useMemo(() => {
    const root = computePathTree(paths, undefined, nonAdjacentPathTrees);

    const flat: (PathBranch<T> | PathLeaf<T>)[] = [];

    const nodeToIndex = new Map<PathBranch<T> | PathLeaf<T>, number>();
    const stack = [...root.children.values()];

    const allIds = new Set<string>();
    const indexToId = new Map<number, string>();
    const idToNode = new Map<string, PathBranch<T> | PathLeaf<T>>();

    let index = 0;
    while (stack.length) {
      const item = stack.shift()!;

      if (item.kind === "leaf") {
        flat.push(item);
      } else {
        flat.push(item);

        const isExpanded = expansions[item.id] ?? expansionDefault;
        if (isExpanded) {
          const children = [...item.children.values()];
          stack.unshift(...children);
        }
      }

      const id = item.kind === "branch" ? item.data.idOccurrence : item.data.id;
      allIds.add(id);
      indexToId.set(index, id);
      nodeToIndex.set(item, index);
      idToNode.set(id, item);
      index++;
    }

    return { flat, nodeToIndex, indexToId, allIds, idToNode, root };
  }, [expansionDefault, expansions, nonAdjacentPathTrees, paths]);

  return { flat, nodeToIndex, indexToId, allIds, idToNode, root };
}
