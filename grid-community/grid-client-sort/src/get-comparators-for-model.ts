import type { API, Column, SortModelItem, SortComparatorFunc } from "@1771technologies/grid-types";
import { getSortComparator } from "./get-sort-comparator";

export function getComparatorsForModel<D, E, I>(
  api: API<D, E, I>,
  sortModel: SortModelItem[],
  lookup: Map<string, Column<D, E, I>>,
) {
  const comparators = sortModel.map<[SortComparatorFunc<D, E, I>, Column<D, E, I>]>((m) => {
    const column = lookup.get(m.columnId)!;
    return [getSortComparator(api, column), column];
  });

  return comparators;
}
