import { computePathTree, type PathProvidedItem } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export function useTreeViewPaths<T extends PathProvidedItem>(paths: T[]) {
  const tree = useMemo(() => {
    const result = computePathTree(paths);

    return [...result.children.values()];
  }, [paths]);

  return tree;
}
