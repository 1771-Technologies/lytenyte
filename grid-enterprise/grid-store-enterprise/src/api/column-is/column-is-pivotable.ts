import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";

export const columnIsPivotable = <D, E>(api: ApiEnterprise<D, E>, c: ColumnEnterprise<D, E>) => {
  if (api.columnIsGridGenerated(c)) return false;

  const base = api.getState().columnBase.peek();

  const pivot = c.columnPivotable ?? base.columnPivotable;

  return Boolean(pivot);
};
