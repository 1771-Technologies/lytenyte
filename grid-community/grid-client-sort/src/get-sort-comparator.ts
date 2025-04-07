import { stringComparator } from "./sort-functions/string-comparator";
import { numberComparator } from "./sort-functions/number-comparator";
import { groupSortComparator } from "./sort-functions/group-sort-comparator";
import { GROUP_COLUMN_PREFIX } from "@1771technologies/grid-constants";
import { makeDateComparator } from "./sort-functions/date-comparator";
import type { ApiPro, ColumnPro, SortComparatorFnPro } from "@1771technologies/grid-types/pro";
import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";

export function getSortComparator<D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  column: ColumnPro<D, E> | ColumnCore<D, E>,
  toDate: (value: unknown, column: ColumnPro<D, E>) => Date,
): SortComparatorFnPro<D, E> {
  api = api as ApiPro<D, E>;
  column = column as ColumnPro<D, E>;

  const comparator = column.sortComparator;
  if (typeof comparator === "function") return comparator;

  if (comparator == null) {
    if (column.id.startsWith(GROUP_COLUMN_PREFIX)) return groupSortComparator;

    const type = column.type ?? "string";
    if (type === "number") return numberComparator;
    if (type === "date") return makeDateComparator(toDate as any);
    return stringComparator;
  }

  if (comparator === "string") return stringComparator;
  if (comparator === "number") return numberComparator;
  if (comparator === "date") return makeDateComparator(toDate as any);

  const sx = api.getState();
  const comparatorFn = sx.sortComparatorFns.peek()[comparator];
  if (!comparatorFn)
    throw new Error(`Failed to find a sort comparator with the name: ${comparator}`);

  return comparatorFn;
}
