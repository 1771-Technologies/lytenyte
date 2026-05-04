import type { RowNode, DimensionSort, SortFn } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import { computeField } from "../root/hooks/use-api/auxiliary-functions/compute-field.js";

export function useSortFn<T>(sort: SortFn<T> | DimensionSort<T>[] | null | undefined): SortFn<T> | null {
  return useMemo(() => {
    if (!sort) return null;
    if (typeof sort === "function") return sort;

    if (sort.length === 0) return null;

    const sortFn: SortFn<T> = (left: RowNode<any>, right: RowNode<any>) => {
      for (const { dim, descending } of sort) {
        if (typeof dim === "function") {
          return descending ? dim(right, left) : dim(left, right);
        }
        const field = dim.field ?? (dim as any).id;
        if (!field) continue;

        const x = computeField(left.kind === "leaf" ? field : ((dim as any)?.id ?? field), left) as any;
        const y = computeField(right.kind === "leaf" ? field : ((dim as any)?.id ?? field), right) as any;

        if (x < y) return descending ? 1 : -1;
        if (x > y) return descending ? -1 : 1;
      }

      return 0;
    };

    return sortFn;
  }, [sort]);
}
