import { t } from "@1771technologies/grid-design";
import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { clsx } from "@1771technologies/js-utils";
import { SortArrowAsc, SortArrowDesc } from "../../components/icons";

export function HeaderCellDefault({ api, column }: ColumnHeaderRendererParamsReact<any>) {
  const label = column.headerName ?? column.id;

  const isSortable = api.columnIsSortable(column);
  const sortDirection = api.columnSortDirection(column);
  const sortIndex = api.columnSortModelIndex(column);

  return (
    <div
      onClick={(ev) => {
        if (!isSortable) return;

        api.columnSortCycleToNext(column, ev.ctrlKey || ev.metaKey);
      }}
      className={clsx(
        css`
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
        `,
        isSortable &&
          css`
            cursor: pointer;
          `,
      )}
    >
      {label}
      {sortDirection === "asc" && (
        <div>
          <SortArrowAsc />
          {sortIndex > 0 && (
            <span className="lng1771-sort-count-number-indicator">{sortIndex}</span>
          )}
        </div>
      )}
      {sortDirection === "desc" && (
        <div>
          <SortArrowDesc />
          {sortIndex > 0 && (
            <span className="lng1771-sort-count-number-indicator">{sortIndex}</span>
          )}
        </div>
      )}
    </div>
  );
}
