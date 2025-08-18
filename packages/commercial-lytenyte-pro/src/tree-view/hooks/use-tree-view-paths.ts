import { computePathTree, type PathProvidedItem } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export function useTreeViewPaths<T extends PathProvidedItem>(
  paths: T[],
  nonAdjacentAreDistinct?: boolean,
) {
  const tree = useMemo(() => {
    const result = computePathTree(paths, {}, nonAdjacentAreDistinct);

    return [...result.children.values()];
  }, [nonAdjacentAreDistinct, paths]);

  return tree;
}
