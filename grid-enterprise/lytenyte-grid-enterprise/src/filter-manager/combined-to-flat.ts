import type { ColumnFilter } from "@1771technologies/grid-types/pro";
import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { FilterCombined } from "@1771technologies/grid-types/core";
import type { FlatSimpleFilters } from "./types";
import { flattenCombinedFilter } from "./flatten-combined-filter";

export function combinedToFlat<D>(
  filter: ColumnFilter<ApiEnterpriseReact<D>, D> | undefined | null,
  column: ColumnEnterpriseReact<D>,
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
    flat = flattenCombinedFilter(filter as FilterCombined<ApiEnterpriseReact<D>, D>);
  }

  return flat;
}
