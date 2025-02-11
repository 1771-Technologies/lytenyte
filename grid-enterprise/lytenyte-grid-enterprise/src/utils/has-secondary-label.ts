import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";

export function hasSecondaryLabel<D>(
  column: ColumnEnterpriseReact<D>,
  hasRowGroup: boolean,
  hasAggFunc: boolean,
  aggFuncDisplayMode: string,
) {
  return (
    column.headerSecondaryLabel || (hasRowGroup && hasAggFunc && aggFuncDisplayMode === "secondary")
  );
}
