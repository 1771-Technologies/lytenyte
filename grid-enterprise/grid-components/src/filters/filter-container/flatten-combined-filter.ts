import type { FilterCombined, FilterSimpleColumn } from "@1771technologies/grid-types/community";
import type { FlatSimpleFilters } from "../simple-filter/simple-filter";
import type { ApiEnterpriseReact } from "@1771technologies/grid-types";

export function flattenCombinedFilter<D>(
  c: FilterCombined<ApiEnterpriseReact<D>, D>,
): FlatSimpleFilters {
  const stack = [c];

  const flat: FlatSimpleFilters = [];
  while (stack.length) {
    const f = stack.pop()!;

    flat.push([f.left as FilterSimpleColumn, f.operator]);
    flat.push([f.right as FilterSimpleColumn, null]);
  }

  return flat;
}
