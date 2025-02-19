import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";

export const columnIsResizable = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  if (api.columnIsGridGenerated(c as any) && !api.columnIsGroupAutoColumn(c as any)) return false;

  const base = api.getState().columnBase.peek();

  return c.resizable ?? base.resizable ?? false;
};
