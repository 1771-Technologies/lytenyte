import type { FilterNumber } from "../+types.js";
import type { FilterNumberSettings } from "./get-number-filter-settings.js";

export function evaluateNumberFilter(
  filter: FilterNumber,
  cv: number | null,
  { includeNulls, absolute, epsilon }: FilterNumberSettings,
) {
  const v = filter.value;

  // The type of the values must be correct, we do not want to unintentionally
  // compare types that are not numbers.
  if (v != null && typeof v != "number") return false;
  if (cv != null && typeof cv != "number") return false;

  switch (filter.operator) {
    case "equals":
      return equals(v, cv, absolute, includeNulls, epsilon);
    case "not_equals":
      if (v != null && cv == null) return includeNulls;
      return !equals(v, cv, absolute, includeNulls, epsilon);
    case "greater_than": {
      if (v == null) return false;
      if (cv == null) return includeNulls;

      if (absolute) return Math.abs(cv) > Math.abs(v);
      return cv > v;
    }
    case "greater_than_or_equals": {
      if (equals(v, cv, absolute, includeNulls, epsilon)) return true;
      if (v == null) return false;
      if (cv == null) return includeNulls;

      if (absolute) return Math.abs(cv) > Math.abs(v);
      return cv > v;
    }
    case "less_than": {
      if (v == null) return false;
      if (cv == null) return includeNulls;

      if (absolute) return Math.abs(cv) < Math.abs(v);
      return cv < v;
    }
    case "less_than_or_equals": {
      if (equals(v, cv, absolute, includeNulls, epsilon)) return true;
      if (v == null) return false;
      if (cv == null) return includeNulls;

      if (absolute) return Math.abs(cv) < Math.abs(v);
      return cv < v;
    }
  }
}

function equals(
  v: number | null,
  cv: number | null,
  absolute: boolean,
  includeNulls: boolean,
  epsilon: number,
) {
  if (v == null && cv == null) return true;
  if (v == null && cv != null) return false;
  if (v != null && cv == null) return includeNulls;

  let diff;
  if (absolute) diff = Math.abs(Math.abs(v!) - Math.abs(cv!));
  else diff = Math.abs(v! - cv!);

  return diff < epsilon;
}
