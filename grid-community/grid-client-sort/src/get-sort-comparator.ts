import { stringComparator } from "./sort-functions/string-comparator";
import { numberComparator } from "./sort-functions/number-comparator";
import { dateComparator } from "./sort-functions/date-comparator";
import { groupSortComparator } from "./sort-functions/group-sort-comparator";
import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import type { SortComparatorFunc } from "@1771technologies/grid-types/community";
import { GROUP_COLUMN_PREFIX } from "@1771technologies/grid-constants";

export function getSortComparator<D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  column: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
): SortComparatorFunc<ApiEnterprise<D, E>, D> {
  api = api as ApiEnterprise<D, E>;
  column = column as ColumnEnterprise<D, E>;

  const comparator = column.sortComparator;
  if (typeof comparator === "function") return comparator;

  if (comparator == null) {
    if (column.id.startsWith(GROUP_COLUMN_PREFIX)) return groupSortComparator;

    const type = column.type ?? "string";
    if (type === "number") return numberComparator;
    if (type === "date") return dateComparator;
    return stringComparator;
  }

  if (comparator === "string") return stringComparator;
  if (comparator === "number") return numberComparator;
  if (comparator === "date") return dateComparator;

  const sx = api.getState();
  const comparatorFunc = sx.sortComparatorFuncs.peek()[comparator];
  if (!comparatorFunc)
    throw new Error(`Failed to find a sort comparator with the name: ${comparator}`);

  return comparatorFunc;
}
