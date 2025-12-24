import type { FilterFn, RowLeaf } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export function useFilteredData<T>(
  pivotMode: boolean,
  filter: FilterFn<T> | undefined | null,
  leafs: RowLeaf<T>[],
) {
  // We now have our filtered
  const filtered = useMemo<number[]>(() => {
    if (!pivotMode) return [];

    if (!filter) return Array.from({ length: leafs.length }, (_, i) => i);

    const filtered = [];
    for (let i = 0; i < leafs.length; i++) {
      const node = leafs[i];
      if (filter(node)) filtered.push(i);
    }

    return filtered;
  }, [filter, leafs, pivotMode]);

  return filtered;
}
