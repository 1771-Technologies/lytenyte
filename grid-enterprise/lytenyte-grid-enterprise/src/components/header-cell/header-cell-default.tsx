import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/enterprise-react";
import { HeaderLabel } from "./header-label";
import { t } from "@1771technologies/grid-design";
import { useEffect, useMemo, useState } from "react";
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

  const [el, setEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const controller = new AbortController();
    parent.addEventListener(
      "click",
      () => {
        api.columnMenuOpen(column, parent);
      },
      { signal: controller.signal },
    );
    parent.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter") {
          api.columnMenuOpen(column, parent);
          event.preventDefault();
          event.stopPropagation();
        }
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [api, column, el]);

  return (
    <div
      role={hasMenu ? "button" : undefined}
      ref={setEl}
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
