import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";

export const columnIsMeasurable = <D, E>(api: ApiEnterprise<D, E>, c: ColumnEnterprise<D, E>) => {
  if (api.columnIsGridGenerated(c)) return false;

  const base = api.getState().columnBase.peek();

  const defaultMeasure = c.measureFnDefault;
  const allowedMeasures = c.measureFnsAllowed ?? base.measureFnsAllowed ?? [];
  const hasMeasureFn = c.measureFn ?? base.measureFn;

  return Boolean(defaultMeasure || hasMeasureFn || allowedMeasures.length > 0);
};
