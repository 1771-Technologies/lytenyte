import type { SemiPartialFilter } from "./types";

export function isFilterComplete(c: SemiPartialFilter) {
  if (!c) return false;

  if (c.kind === "text") {
    return c.operator;
  }
  if (c.kind === "number") {
    return c.operator && typeof c.value === "number";
  }

  if (c.operator === "all_dates_in_the_period") return c.datePeriod;
  if (c.operator === "after" || c.operator === "before" || c.operator === "equal") return c.value;

  return !!c.operator;
}
