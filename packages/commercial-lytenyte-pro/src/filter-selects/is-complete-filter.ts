import type { FilterSelectFlat } from "./use-filter-select";

export function isCompleteFilter(c: FilterSelectFlat) {
  if (c.kind === "function") return true;

  return c.operator != null && c.value !== undefined;
}
