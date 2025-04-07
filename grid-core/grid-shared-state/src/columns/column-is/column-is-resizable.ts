import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsResizable = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  if (api.columnIsGridGenerated(c as any) && !api.columnIsGroupAutoColumn(c as any)) return false;

  const base = api.getState().columnBase.peek();

  return c.resizable ?? base.resizable ?? false;
};
