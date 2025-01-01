import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";

export const columnIsMeasurable = <D, E>(api: ApiEnterprise<D, E>, c: ColumnEnterprise<D, E>) => {
  if (api.columnIsGridGenerated(c)) return false;

  const base = api.getState().columnBase.peek();

  const defaultMeasure = c.measureFuncDefault ?? base.measureFuncDefault;
  const allowedMeasures = c.measureFuncsAllowed ?? base.measureFuncsAllowed ?? [];
  const hasMeasureFunc = c.measureFunc ?? base.measureFunc;

  return Boolean(defaultMeasure || hasMeasureFunc || allowedMeasures.length > 0);
};
