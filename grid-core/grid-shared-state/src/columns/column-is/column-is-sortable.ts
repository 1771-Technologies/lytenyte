import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsSortable = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  const base = api.getState().columnBase.peek();
  if (api.columnIsGridGenerated(c as any) && !api.columnIsGroupAutoColumn(c as any)) return false;

  return c.sortable ?? base.sortable ?? false;
};
