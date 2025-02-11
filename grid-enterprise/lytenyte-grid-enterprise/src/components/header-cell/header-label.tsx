import { t } from "@1771technologies/grid-design";
import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { getAggFuncDisplayMode } from "../../utils/get-agg-func-display-mode";
import { getHeaderName } from "../../utils/get-header-name";
import { getAggFuncName } from "../../utils/get-agg-func-name";
import { hasSecondaryLabel } from "../../utils/has-secondary-label";

interface HeaderLabelProps {
  readonly column: ColumnEnterpriseReact<any>;
  readonly api: ApiEnterpriseReact<any>;
}

export function HeaderLabel({ column, api }: HeaderLabelProps) {
  const sx = api.getState();
  const base = sx.columnBase.peek();
  const hasGroup = sx.rowGroupModel.peek().length > 0;

  const headerName = getHeaderName(column);
  const aggFuncDisplayMode = getAggFuncDisplayMode(column, base);
  const columnAggFunc = getAggFuncName(column);

  const hasAggFunc = !!column.aggFunc;
  const hasSecondary = hasSecondaryLabel(column, hasGroup, hasAggFunc, aggFuncDisplayMode);

  return (
    <>
      <div
        className={css`
          display: flex;
          align-items: center;
          gap: 2px;
        `}
      >
        <span>{headerName}</span>
        {hasAggFunc && hasGroup && aggFuncDisplayMode === "inline" && (
          <span
            className={css`
              color: ${t.headerFgAgg};
              font-size: ${t.headerFontSizeAlt};
              font-weight: ${t.headerFontWeightAlt};
            `}
          >
            (sum) ({columnAggFunc})
          </span>
        )}
      </div>

      {hasSecondary && (
        <div
          className={css`
            display: flex;
            align-items: center;
            gap: 2px;
            position: relative;
            top: -2px;
          `}
        >
          {column.headerSecondaryLabel && (
            <span
              className={css`
                font-size: ${t.headerFontSizeAlt};
                color: ${t.colors.text_light};
              `}
            >
              {column.headerSecondaryLabel}
            </span>
          )}
          {hasGroup && hasAggFunc && aggFuncDisplayMode === "secondary" && (
            <span
              className={css`
                color: ${t.colors.primary_50};
                font-size: ${t.typography.body_xs};
                font-weight: 600;
              `}
            >
              ({columnAggFunc})
            </span>
          )}
        </div>
      )}
    </>
  );
}
