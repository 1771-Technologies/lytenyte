import { t } from "@1771technologies/grid-design";
import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { clsx } from "@1771technologies/js-utils";

interface HeaderLabelProps {
  readonly column: ColumnEnterpriseReact<any>;
  readonly api: ApiEnterpriseReact<any>;
}
export function HeaderLabel({ column, api }: HeaderLabelProps) {
  const sx = api.getState();
  const base = sx.columnBase.peek();
  const rowGroupModel = sx.rowGroupModel.peek().length > 0;

  const headerName = column.headerName ?? column.id;

  const aggFuncDisplayMode =
    column.headerAggFuncDisplayMode ?? base.headerAggFuncDisplayMode ?? "inline";
  const columnAggFunc = typeof column.aggFunc === "string" ? column.aggFunc : "FN(X)";
  const hasAggFunc = !!column.aggFunc;

  const hasSecondary =
    column.headerSecondaryLabel ||
    (rowGroupModel && hasAggFunc && aggFuncDisplayMode === "secondary");

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-inline: ${t.spacing.cell_horizontal_padding};
        width: 100%;
        height: 100%;

        color: ${t.colors.text_x_light};
        font-size: ${t.typography.body_m};
        font-family: ${t.typography.typeface_body};
        font-weight: 500;
        line-height: 20px;
        background-color: ${t.colors.backgrounds_ui_panel};
      `}
    >
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
