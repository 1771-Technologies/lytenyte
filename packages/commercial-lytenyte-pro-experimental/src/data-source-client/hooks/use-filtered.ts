import type { FilterFn, RowLeaf } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export function useFiltered<T>(leafs: RowLeaf<T>[], filter: FilterFn<T> | undefined) {
  const filtered = useMemo(() => {
    if (!filter) return null;

    const filtered = [];
    for (let i = 0; i < leafs.length; i++) {
      const node = leafs[i];
      if (filter(node)) filtered.push(i);
    }

    return filtered;
  }, [filter, leafs]);

  return filtered;
}
