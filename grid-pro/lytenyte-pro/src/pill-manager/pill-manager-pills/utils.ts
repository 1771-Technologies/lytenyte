import type { ColumnBaseProReact, ColumnProReact } from "@1771technologies/grid-types/pro-react";

export const canAgg = (c: ColumnProReact<any>, base: ColumnBaseProReact<any>) => {
  return Boolean(c.aggFnDefault ?? c.aggFnsAllowed?.length ?? base.aggFnsAllowed?.length);
};
export const canMeasure = (c: ColumnProReact<any>, base: ColumnBaseProReact<any>) => {
  return Boolean(
    c.measureFnDefault ?? c.measureFnsAllowed?.length ?? base.measureFnsAllowed?.length,
  );
};
