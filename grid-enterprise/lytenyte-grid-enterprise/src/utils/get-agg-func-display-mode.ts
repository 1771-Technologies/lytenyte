import type {
  ColumnBaseEnterpriseReact,
  ColumnEnterpriseReact,
} from "@1771technologies/grid-types";

export function getAggFuncDisplayMode<D>(
  column: ColumnEnterpriseReact<D>,
  base: ColumnBaseEnterpriseReact<D>,
) {
  return column.headerAggFuncDisplayMode ?? base.headerAggFuncDisplayMode ?? "inline";
}
