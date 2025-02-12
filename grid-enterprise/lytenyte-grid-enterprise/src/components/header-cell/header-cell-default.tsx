import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/enterprise-react";
import { HeaderLabel } from "./header-label";
import { t } from "@1771technologies/grid-design";
import { useMemo } from "react";
import { clsx } from "@1771technologies/js-utils";

export const iconCls = css``;

export function HeaderCellDefault({ column, api }: ColumnHeaderRendererParamsReact<any>) {
  const sx = api.getState();
  const base = sx.columnBase.use();

  const menuItemsFn = column.columnMenuGetItems ?? base.columnMenuGetItems;

  const menuItems = useMemo(() => {
    if (!menuItemsFn) return [];

    return menuItemsFn(api);
  }, [api, menuItemsFn]);

  const hasMenu = menuItems.length > 0;

  return (
    <div
      onFocus={(event) => {
        console.log(event);
      }}
      role={hasMenu ? "button" : undefined}
      onClick={(event) => {
        api.columnMenuOpen(column, event.currentTarget.parentElement!);
      }}
      className={clsx(
        css`
          display: flex;
          align-items: center;
          box-sizing: border-box;
          height: 100%;
          padding-inline: 4px;
          border-radius: 4px;
          transition: background-color ${t.transitions.normal} ${t.transitions.fn};
        `,
        hasMenu &&
          css`
            &:hover {
              background-color: ${t.headerBgHover};
            }
          `,
      )}
    >
      <HeaderLabel api={api} column={column} />
    </div>
  );
}
