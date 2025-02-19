import type { ColumnFilter } from "@1771technologies/grid-types/enterprise";
import type { FlatSimpleFilters } from "../simple-filter/simple-filter";
import { isFilterComplete } from "./is-filter-complete";
import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import type { FilterCombined, FilterSimpleColumn } from "@1771technologies/grid-types/community";

export function flatToCombined<D>(
  flat: FlatSimpleFilters,
): ColumnFilter<ApiEnterpriseReact<D>, D> | null {
  const [left, right] = flat;

  const leftFilter = isFilterComplete(left?.[0]) ? (left?.[0] as FilterSimpleColumn) : null;
  const rightFilter = isFilterComplete(right?.[0]) ? (right?.[0] as FilterSimpleColumn) : null;
  const operator = left?.[1] as "and" | "or";

  if (!leftFilter && rightFilter) return { ...rightFilter };
  if (leftFilter && !rightFilter) return { ...leftFilter };
  if (!leftFilter && !rightFilter) return null;

  const combined: FilterCombined<ApiEnterpriseReact<D>, D> = {
    kind: "combined",
    left: leftFilter!,
    right: rightFilter!,
    operator: operator,
  };

  return combined;
}
