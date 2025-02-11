import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/enterprise-react";
import { HeaderLabel } from "./header-label";
import { SortButton } from "./sort-button";
import { FilterButton } from "./filter-button";
import { ColumnMenu } from "./menu-button";
import { t } from "@1771technologies/grid-design";

export const iconCls = css``;

export function HeaderCellDefault({ column, api }: ColumnHeaderRendererParamsReact<any>) {
  const sx = api.getState();
  const base = sx.columnBase.use();

  const menuTrigger =
    column.columnMenuShowTriggerInHeader ?? base.columnMenuShowTriggerInHeader ?? false;
  const filterTrigger = column.filterShowTriggerInHeader ?? base.filterShowTriggerInHeader ?? false;
  const sortable = api.columnIsSortable(column);

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 100%;
        padding-inline: 4px;
        border-radius: 4px;
        transition: background-color ${t.transitions.normal} ${t.transitions.fn};

        &:hover {
          background-color: ${t.headerBgHover};
        }
      `}
    >
      <div
        className={css`
          position: relative;
          width: 100%;
        `}
      >
        <HeaderLabel api={api} column={column} />
        <div
          className={css`
            position: absolute;
            inset-inline-end: 0px;
            gap: 2px;
          `}
        >
          {sortable && <SortButton api={api} column={column} />}
          {filterTrigger && <FilterButton api={api} column={column} />}
          {menuTrigger && <ColumnMenu api={api} column={column} />}
        </div>
      </div>
    </div>
  );
}
