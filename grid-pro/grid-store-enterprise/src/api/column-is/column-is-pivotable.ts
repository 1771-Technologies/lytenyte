import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsPivotable = <D, E>(api: ApiPro<D, E>, c: ColumnPro<D, E>) => {
  if (api.columnIsGridGenerated(c)) return false;

  const base = api.getState().columnBase.peek();

  const pivot = c.columnPivotable ?? base.columnPivotable;

  return Boolean(pivot);
};
