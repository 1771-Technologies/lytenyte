import { DEFAULT_SORT_CYCLE } from "@1771technologies/grid-constants";
import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnSortCycle = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  api = api as ApiCore<D, E>;
  c = c as ColumnCore<D, E>;

  if (!api.columnIsSortable(c)) return null;

  const s = api.getState();
  const base = s.columnBase.peek();

  return c.sortCycle ?? base.sortCycle ?? DEFAULT_SORT_CYCLE;
};
