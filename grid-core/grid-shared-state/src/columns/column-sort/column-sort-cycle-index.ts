import type {
  ApiCore,
  ColumnCore,
  SortCycleOptionCore,
  SortModelItemCore,
} from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnSortCycleIndex = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  api = api as ApiCore<D, E>;
  c = c as ColumnCore<D, E>;

  if (!api.columnIsSortable(c)) return null;

  const sortCycle = api.columnSortCycle(c)!;
  const sortIndex = api.columnSortModelIndex(c);

  if (sortIndex === -1) return null;

  const s = api.getState();

  const currentModelValue = s.sortModel.peek()[sortIndex];
  const sortString = getSortOptionValueFromSort(currentModelValue);

  return sortCycle.indexOf(sortString);
};

function getSortOptionValueFromSort(sort: SortModelItemCore): SortCycleOptionCore {
  const parts = [sort.isDescending ? "desc" : "asc"];
  if (!sort.options) return parts[0] as SortCycleOptionCore;

  if (sort.options.isAccented) parts.push("accented");
  if (sort.options.isAbsolute) parts.push("abs");
  if (sort.options.nullsAppearFirst) parts.push("nulls-first");

  return parts.join("_") as SortCycleOptionCore;
}
