import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";

export function getAggFuncName<D>(column: ColumnEnterpriseReact<D>) {
  const columnAggFunc = typeof column.aggFunc === "string" ? column.aggFunc : "FN(X)";
  return columnAggFunc;
}
