import { isFilterComplete } from "./is-filter-complete";
import type { FlatSimpleFilters } from "./types";
import type {
  ColumnFilterProReact,
  FilterCombinedProReact,
  FilterSimpleColumnProReact,
} from "../types";

export function flatToCombined<D>(flat: FlatSimpleFilters): ColumnFilterProReact<D> | null {
  const [left, right] = flat;

  const leftFilter = isFilterComplete(left?.[0]) ? (left?.[0] as FilterSimpleColumnProReact) : null;
  const rightFilter = isFilterComplete(right?.[0])
    ? (right?.[0] as FilterSimpleColumnProReact)
    : null;
  const operator = left?.[1] as "and" | "or";

  if (!leftFilter && rightFilter) return { ...rightFilter };
  if (leftFilter && !rightFilter) return { ...leftFilter };
  if (!leftFilter && !rightFilter) return null;

  const combined: FilterCombinedProReact<D> = {
    kind: "combined",
    left: leftFilter!,
    right: rightFilter!,
    operator: operator,
  };

  return combined;
}
