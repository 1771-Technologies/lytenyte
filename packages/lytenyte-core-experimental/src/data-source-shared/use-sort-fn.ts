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
        const field = dim.field ?? (dim as any).id;
        if (!field) continue;

        const x = computeField(field, left) as any;
        const y = computeField(field, right) as any;

        if (x < y) return descending ? 1 : -1;
        if (x > y) return descending ? -1 : 1;
      }

      return 0;
    };

    return sortFn;
  }, [sort]);
}
