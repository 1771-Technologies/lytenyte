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
        flex-direction: column;
      `}
    >
      <div
        className={clsx(
          css`
            display: flex;
            align-items: center;
            gap: 3px;
          `,
          hasSecondary &&
            css`
              position: relative;
              top: 4px;
            `,
        )}
      >
        {headerName}
        {hasAggFunc && rowGroupModel && aggFuncDisplayMode === "inline" && (
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
      <div
        className={css`
          display: flex;
          align-items: center;
          gap: 3px;
          position: relative;
        `}
      >
        {column.headerSecondaryLabel && (
          <span
            className={css`
              font-size: ${t.typography.body_xs};
              color: ${t.colors.text_light};
            `}
          >
            {column.headerSecondaryLabel}
          </span>
        )}
        {rowGroupModel && hasAggFunc && aggFuncDisplayMode === "secondary" && (
          <span
            className={css`
              color: ${t.colors.primary_50};
              font-size: ${t.typography.body_xs};
              font-weight: 600;
            `}
          >
            {" "}
            ({columnAggFunc})
          </span>
        )}
      </div>
    </div>
  );
}
