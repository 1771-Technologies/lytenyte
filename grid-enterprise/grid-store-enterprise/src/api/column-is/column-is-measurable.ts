import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsMeasurable = <D, E>(api: ApiPro<D, E>, c: ColumnPro<D, E>) => {
  if (api.columnIsGridGenerated(c)) return false;

  const base = api.getState().columnBase.peek();

  const defaultMeasure = c.measureFnDefault;
  const allowedMeasures = c.measureFnsAllowed ?? base.measureFnsAllowed ?? [];

  return Boolean(defaultMeasure || allowedMeasures.length > 0);
};
