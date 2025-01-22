import { t } from "@1771technologies/grid-design";
import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { clsx } from "@1771technologies/js-utils";
import type { JSX } from "react";

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
const SortArrowAsc = (p: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M5.21619 7.78332L10 2.99951M10 2.99951L14.7838 7.78332M10 2.99951L10 16.481"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const SortArrowDesc = (p: JSX.IntrinsicElements["svg"]) => {
  return (
    <SortArrowAsc
      className={css`
        transform: rotate(180deg);
      `}
      {...p}
    />
  );
};
