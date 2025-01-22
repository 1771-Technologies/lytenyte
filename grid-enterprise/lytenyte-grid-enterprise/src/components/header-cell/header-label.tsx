import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { clsx } from "@1771technologies/js-utils";

interface HeaderLabelProps {
  readonly column: ColumnEnterpriseReact<any>;
  readonly api: ApiEnterpriseReact<any>;
}
export function HeaderLabel({ column, api }: HeaderLabelProps) {
  const sx = api.getState();
  const base = sx.columnBase.peek();
  const rowGroupModel = sx.rowGroupModel.peek();

  const headerName = column.headerName ?? column.id;

  const aggFuncDisplayMode =
    column.headerAggFuncDisplayMode ?? base.headerAggFuncDisplayMode ?? "inline";
  const columnAggFunc = typeof column.aggFunc === "string" ? column.aggFunc : "FN(X)";
  const hasAggFunc = !!column.aggFunc;

  const hasSecondary =
    column.headerSecondaryLabel ||
    (rowGroupModel.length > 0 && hasAggFunc && aggFuncDisplayMode === "secondary");

  return (
    <div className="lng1771-header-cell-label-root">
      <div
        className={clsx(
          "lng1771-header-cell-label",
          hasSecondary && "lng1771-header-cell-label-with-secondary",
        )}
      >
        {headerName}
        {hasAggFunc && rowGroupModel && aggFuncDisplayMode === "inline" && (
          <span className="lng1771-header-cell-agg-label"> ({columnAggFunc})</span>
        )}
      </div>
      <div className="lng1771-header-cell-label-secondary-root">
        {column.headerSecondaryLabel && (
          <span className="lng1771-header-cell-secondary-label">{column.headerSecondaryLabel}</span>
        )}
        {rowGroupModel && hasAggFunc && aggFuncDisplayMode === "secondary" && (
          <span className="lng1771-header-cell-agg-label"> ({columnAggFunc})</span>
        )}
      </div>
    </div>
  );
}
