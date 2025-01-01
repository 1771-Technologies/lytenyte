import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import { getSortComparator } from "./get-sort-comparator";
import type { SortComparatorFunc, SortModelItem } from "@1771technologies/grid-types/community";

export function getComparatorsForModel<D, E>(
  api: ApiEnterprise<D, E>,
  sortModel: SortModelItem[],
  lookup: Map<string, ColumnEnterprise<D, E>>,
) {
  const comparators = sortModel.map<
    [SortComparatorFunc<ApiEnterprise<D, E>, D>, ColumnEnterprise<D, E>]
  >((m) => {
    const column = lookup.get(m.columnId)!;
    return [getSortComparator(api, column), column];
  });

  return comparators;
}
