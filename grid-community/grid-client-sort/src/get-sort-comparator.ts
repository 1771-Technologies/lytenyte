import type { API, Column, SortComparatorFunc } from "@1771technologies/grid-types";
import { stringComparator } from "./sort-functions/string-comparator";
import { numberComparator } from "./sort-functions/number-comparator";
import { dateComparator } from "./sort-functions/date-comparator";
import { LYTENYTE_GROUP_COLUMN_PREFIX } from "@1771technologies/grid-constants";
import { groupSortComparator } from "./sort-functions/group-sort-comparator";

export function getSortComparator<D, E, I>(
  api: API<D, E, I>,
  column: Column<D, E, I>,
): SortComparatorFunc<D, E, I> {
  const comparator = column.sortComparator;

  if (typeof comparator === "function") return comparator;

  if (comparator == null) {
    if (column.id.startsWith(LYTENYTE_GROUP_COLUMN_PREFIX)) return groupSortComparator;

    const type = column.type ?? "string";
    if (type === "number") return numberComparator;
    if (type === "date") return dateComparator;
    return stringComparator;
  }

  if (comparator === "string") return stringComparator;
  if (comparator === "number") return numberComparator;
  if (comparator === "date") return dateComparator;

  const comparatorFunc = api.sortComparators()[comparator];
  if (!comparatorFunc)
    throw new Error(`Failed to find a sort comparator with the name: ${comparator}`);

  return comparatorFunc;
}
