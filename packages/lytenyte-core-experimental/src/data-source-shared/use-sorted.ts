import type { RowLeaf, SortFn } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export function useSorted<T>(
  leafs: RowLeaf<T>[],
  sort: SortFn<T> | null | undefined,
  filtered: number[] | null,
) {
  const sorted = useMemo(() => {
    if (!sort) {
      if (filtered) return filtered;
      return Array.from({ length: leafs.length }, (_, i) => i);
    }

    if (filtered) {
      return filtered.toSorted((li, ri) => {
        const leftNode = leafs[li];
        const rightNode = leafs[ri];

        return sort(leftNode, rightNode);
      });
    }

    return Array.from({ length: leafs.length }, (_, i) => i).sort((li, ri) => {
      const leftNode = leafs[li];
      const rightNode = leafs[ri];

      return sort(leftNode, rightNode);
    });
  }, [filtered, leafs, sort]);

  return sorted;
}
