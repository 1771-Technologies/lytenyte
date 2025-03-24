import type {
  ColumnBaseEnterpriseReact,
  ColumnEnterpriseReact,
} from "@1771technologies/grid-types";

export const canAgg = (c: ColumnEnterpriseReact<any>, base: ColumnBaseEnterpriseReact<any>) => {
  return c.aggFnDefault ?? c.aggFnsAllowed?.length ?? base.aggFnsAllowed?.length;
};
export const canMeasure = (c: ColumnEnterpriseReact<any>, base: ColumnBaseEnterpriseReact<any>) => {
  return c.measureFnDefault ?? c.measureFnsAllowed?.length ?? base.measureFnsAllowed?.length;
};
