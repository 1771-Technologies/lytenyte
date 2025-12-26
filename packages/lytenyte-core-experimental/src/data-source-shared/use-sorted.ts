import type { RowLeaf, SortFn } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export function useSorted<T>(
  leafs: RowLeaf<T>[],
  sort: SortFn<T> | null | undefined,
  filtered: number[] | null,
) {
  const sorted = useMemo(() => {
    const centerMap = new Map<string, RowLeaf<T>>();
    let finalSorted: number[];
    if (!sort) {
      if (filtered) finalSorted = filtered;
      finalSorted = Array.from({ length: leafs.length }, (_, i) => i);
    } else if (filtered) {
      finalSorted = filtered.toSorted((li, ri) => {
        const leftNode = leafs[li];
        const rightNode = leafs[ri];

        return sort(leftNode, rightNode);
      });
    } else {
      finalSorted = Array.from({ length: leafs.length }, (_, i) => i).sort((li, ri) => {
        const leftNode = leafs[li];
        const rightNode = leafs[ri];

        return sort(leftNode, rightNode);
      });
    }

    for (let i = 0; i < finalSorted.length; i++) {
      const row = leafs[finalSorted[i]];
      centerMap.set(row.id, row);
    }

    return [finalSorted, centerMap] as const;
  }, [filtered, leafs, sort]);

  return sorted;
}
