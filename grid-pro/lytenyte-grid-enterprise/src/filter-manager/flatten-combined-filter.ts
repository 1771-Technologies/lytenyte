import type { FilterCombinedProReact, FilterSimpleColumnProReact } from "../types";
import type { FlatSimpleFilters } from "./types";

export function flattenCombinedFilter<D>(c: FilterCombinedProReact<D>): FlatSimpleFilters {
  const stack = [c];

  const flat: FlatSimpleFilters = [];
  while (stack.length) {
    const f = stack.pop()!;

    flat.push([f.left as FilterSimpleColumnProReact, f.operator]);
    flat.push([f.right as FilterSimpleColumnProReact, null]);
  }

  return flat;
}
