import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { clsx } from "@1771technologies/js-utils";
import {
  GridButton,
  SortArrowAsc,
  SortArrowDesc,
} from "@1771technologies/lytenyte-grid-community/internal";
import { iconCls } from "./header-cell-default";
import { t } from "@1771technologies/grid-design";

export interface SortButtonProps {
  readonly api: ApiEnterpriseReact<any>;
  readonly column: ColumnEnterpriseReact<any>;
  readonly justify: "flex-end" | "flex-start" | "center";
}
export function SortButton({ api, column, justify }: SortButtonProps) {
  const sortDirection = api.columnSortDirection(column);
  const sortIndex = api.columnSortModelIndex(column) + 1;
  const nextSort = api.columnSortGetNext(column);

  const model = api.getState().sortModel.use();
  const multipleSorts = model.length > 1;

  const NextSortIcon =
    sortDirection == null ? (nextSort?.includes("desc") ? SortArrowDesc : SortArrowAsc) : null;

  const style = justify === "flex-end" ? { insetInlineStart: "4px" } : { insetInlineEnd: "4px" };
  return (
    <GridButton
      tabIndex={-1}
      style={style}
      className={clsx(
        iconCls,
        sortDirection != null &&
          css`
            opacity: 1 !important;
          `,
        sortDirection == null &&
          css`
            color: ${t.colors.text_light};
          `,
      )}
      onClickCapture={(event) => {
        event.stopPropagation();
        event.preventDefault();
        if (!api.columnIsSortable(column)) return;

        api.columnSortCycleToNext(column, event.ctrlKey || event.metaKey);
      }}
    >
      {NextSortIcon && (
        <NextSortIcon
          width={16}
          height={16}
          className={css`
            position: relative;
            top: 1px;
          `}
        />
      )}
      {sortDirection === "asc" && (
        <>
          <SortArrowAsc
            width={16}
            height={16}
            className={css`
              position: relative;
              top: 1px;
            `}
          />
          {multipleSorts && sortIndex > 0 && (
            <span
              className={css`
                position: absolute;
                top: 0px;
                inset-inline-end: 0px;
                font-size: 11px;
              `}
            >
              {sortIndex}
            </span>
          )}
        </>
      )}
      {sortDirection === "desc" && (
        <>
          <SortArrowDesc
            width={16}
            height={16}
            className={css`
              transform: rotate(180deg);
              position: relative;
              top: 1px;
            `}
          />
          {multipleSorts && sortIndex > 0 && (
            <span
              className={css`
                position: absolute;
                top: 0px;
                inset-inline-end: 0px;
                font-size: 11px;
              `}
            >
              {sortIndex}
            </span>
          )}
        </>
      )}
    </GridButton>
  );
}
