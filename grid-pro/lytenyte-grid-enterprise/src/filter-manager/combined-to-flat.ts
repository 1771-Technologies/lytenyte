import type { FlatSimpleFilters } from "./types";
import { flattenCombinedFilter } from "./flatten-combined-filter";
import type { ColumnFilterProReact, ColumnProReact, FilterCombinedProReact } from "../types";

export function combinedToFlat<D>(
  filter: ColumnFilterProReact<D> | undefined | null,
  column: ColumnProReact<D>,
) {
  const columnId = column.id;

  let flat: FlatSimpleFilters;
  if (!filter) {
    flat = [
      [{ columnId, kind: column.type === "complex" ? "text" : (column.type ?? "text") }, null],
    ];
  } else if (filter.kind === "number" || filter.kind === "text" || filter.kind === "date") {
    flat = [
      [filter, "and"],
      [{ columnId, kind: filter.kind }, null],
    ];
  } else {
    flat = flattenCombinedFilter(filter as FilterCombinedProReact<D>);
  }

  return flat;
}
