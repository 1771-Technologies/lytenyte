import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import { getSortComparator } from "./get-sort-comparator";
import type { SortComparatorFn, SortModelItem } from "@1771technologies/grid-types/core";

export function getComparatorsForModel<D, E>(
  api: ApiEnterprise<D, E>,
  sortModel: SortModelItem[],
  lookup: Map<string, ColumnEnterprise<D, E>>,
  toDate: (value: unknown, column: ColumnEnterprise<D, E>) => Date,
) {
  const comparators = sortModel.map<
    [SortComparatorFn<ApiEnterprise<D, E>, D>, ColumnEnterprise<D, E>]
  >((m) => {
    const column = lookup.get(m.columnId)!;
    return [getSortComparator(api, column, toDate), column];
  });

  return comparators;
}
