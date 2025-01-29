import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/enterprise-react";
import { HeaderLabel } from "./header-cell/header-label";
import { t } from "@1771technologies/grid-design";
import { SortButton } from "./header-cell/sort-button";
import { FilterButton } from "./header-cell/filter-button";
import { ColumnMenu } from "./header-cell/menu-button";

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
        padding-inline: ${t.spacing.cell_horizontal_padding};
        width: 100%;
        height: 100%;

        color: ${t.colors.text_x_light};
        font-size: ${t.typography.body_m};
        font-family: ${t.typography.typeface_body};
        font-weight: 500;
        line-height: 20px;
        background-color: ${t.colors.backgrounds_ui_panel};

        & .${iconCls} {
          opacity: 0;
          transition: opacity ${t.transitions.fast} ${t.transitions.fn};
        }
        &:hover .${iconCls} {
          opacity: 1;
        }
      `}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          position: relative;
          width: 100%;
        `}
      >
        <HeaderLabel api={api} column={column} />
        <div
          className={css`
            position: absolute;
            inset-inline-end: 0px;
            gap: ${t.spacing.space_02};
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
