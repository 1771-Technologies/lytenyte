import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import type { SortModelItem, SortCycleOption } from "@1771technologies/grid-types/community";

export const columnSortCycleIndex = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  api = api as ApiCommunity<D, E>;
  c = c as ColumnCommunity<D, E>;

  if (!api.columnIsSortable(c)) return null;

  const sortCycle = api.columnSortCycle(c)!;
  const sortIndex = api.columnSortModelIndex(c);

  if (sortIndex === -1) return null;

  const s = api.getState();

  const currentModelValue = s.sortModel.peek()[sortIndex];
  const sortString = getSortOptionValueFromSort(currentModelValue);

  return sortCycle.indexOf(sortString);
};

function getSortOptionValueFromSort(sort: SortModelItem): SortCycleOption {
  const parts = [sort.isDescending ? "desc" : "asc"];
  if (!sort.options) return parts[0] as SortCycleOption;

  if (sort.options.isAccented) parts.push("accented");
  if (sort.options.isAbsolute) parts.push("abs");
  if (sort.options.nullsAppearFirst) parts.push("nulls-first");

  return parts.join("_") as SortCycleOption;
}
