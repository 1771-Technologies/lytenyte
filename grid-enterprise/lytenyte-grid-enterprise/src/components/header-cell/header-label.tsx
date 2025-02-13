import { t } from "@1771technologies/grid-design";
import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { getAggFuncDisplayMode } from "../../utils/get-agg-func-display-mode";
import { getHeaderName } from "../../utils/get-header-name";
import { getAggFuncName } from "../../utils/get-agg-func-name";
import { hasSecondaryLabel } from "../../utils/has-secondary-label";

interface HeaderLabelProps {
  readonly column: ColumnEnterpriseReact<any>;
  readonly api: ApiEnterpriseReact<any>;
  readonly justify: "flex-end" | "flex-start" | "center";
}

export function HeaderLabel({ column, api, justify }: HeaderLabelProps) {
  const sx = api.getState();
  const base = sx.columnBase.peek();
  const hasGroup = sx.rowGroupModel.peek().length > 0;

  const headerName = getHeaderName(column);
  const aggFuncDisplayMode = getAggFuncDisplayMode(column, base);
  const columnAggFunc = getAggFuncName(column);

  const hasAggFunc = !!column.aggFunc;
  const hasSecondary = hasSecondaryLabel(column, hasGroup, hasAggFunc, aggFuncDisplayMode);

  const hasSecondaryAgg = hasGroup && hasAggFunc && aggFuncDisplayMode === "secondary";

  return (
    <div>
      <div
        style={{ justifyContent: justify }}
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
          style={{
            justifyContent: justify,
            flexDirection: justify === "flex-end" && hasSecondaryAgg ? "row-reverse" : "row",
          }}
          className={css`
            display: flex;
            align-items: center;
            gap: 2px;
            position: relative;
            top: -1px;
          `}
        >
          {column.headerSecondaryLabel && (
            <span
              className={css`
                font-size: ${t.headerFontSizeAlt};
                color: ${t.headerFgAlt};
              `}
            >
              {column.headerSecondaryLabel}
            </span>
          )}
          {hasSecondaryAgg && (
            <span
              className={css`
                color: ${t.headerFgAgg};
                font-size: ${t.headerFontSizeAlt};
                font-weight: ${t.headerFontWeightAlt};
              `}
            >
              FN ({columnAggFunc})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
