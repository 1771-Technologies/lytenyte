import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import type { FilterCombined } from "@1771technologies/grid-types/community";

export function combinedFilterIsForColumn<D>(
  c: FilterCombined<ApiEnterpriseReact<D>, D>,
  id: string,
) {
  const left = c.left;
  const right = c.right;

  if (left.kind === "function" || right.kind === "function") {
    return false;
  }

  if (left.kind === "number" || left.kind === "date" || left.kind === "text") {
    if (left.columnId !== id) return false;
  }
  if (right.kind === "number" || right.kind === "date" || right.kind === "text") {
    if (right.columnId !== id) return false;
  }

  return (
    ["number", "date", "text"].includes(right.kind) &&
    ["number", "date", "text"].includes(left.kind)
  );
}
