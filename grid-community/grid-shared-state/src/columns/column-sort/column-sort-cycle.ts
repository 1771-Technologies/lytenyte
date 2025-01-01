import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import { DEFAULT_SORT_CYCLE } from "@1771technologies/grid-constants";

export const columnSortCycle = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  api = api as ApiCommunity<D, E>;
  c = c as ColumnCommunity<D, E>;

  if (api.columnIsSortable(c)) return null;

  const s = api.getState();
  const base = s.columnBase.peek();

  return c.sortCycle ?? base.sortCycle ?? DEFAULT_SORT_CYCLE;
};
