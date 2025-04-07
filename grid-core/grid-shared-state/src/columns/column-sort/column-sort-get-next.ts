import type { ApiCore, ColumnCore, SortCycleOptionCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnSortGetNext = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
): SortCycleOptionCore => {
  api = api as ApiPro<D, E>;
  c = c as ColumnPro<D, E>;

  if (!api.columnIsSortable(c)) return null;

  const index = api.columnSortCycleIndex(c);
  const sortCycle = api.columnSortCycle(c)!;

  if (index == null) return sortCycle[0];

  return sortCycle[(index + 1) % sortCycle.length];
};
