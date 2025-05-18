import type {
  ApiPro,
  ColumnPro,
  SortComparatorFnPro,
  SortModelItemPro,
} from "@1771technologies/grid-types/pro";
import { getSortComparator } from "./get-sort-comparator";

export function getComparatorsForModel<D, E>(
  api: ApiPro<D, E>,
  sortModel: SortModelItemPro[],
  lookup: Map<string, ColumnPro<D, E>>,
  toDate: (value: unknown, column: ColumnPro<D, E>) => Date,
) {
  const comparators = sortModel.map<[SortComparatorFnPro<D, E>, ColumnPro<D, E>]>((m) => {
    const column = lookup.get(m.columnId)!;
    return [getSortComparator(api, column, toDate), column];
  });

  return comparators;
}
