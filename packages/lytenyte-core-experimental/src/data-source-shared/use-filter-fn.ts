import type { FilterFn } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export function useFilterFn<T>(filter: FilterFn<T> | FilterFn<T>[] | null | undefined): FilterFn<T> | null {
  return useMemo<FilterFn<T> | null>(() => {
    if (!filter) return null;
    if (!Array.isArray(filter)) return filter;

    return (node) => {
      return filter.every((fn) => fn(node));
    };
  }, [filter]);
}
