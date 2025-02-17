import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/enterprise-react";
import { HeaderLabel } from "./header-label";
import { t } from "@1771technologies/grid-design";
import { useEffect, useMemo, useState } from "react";
import { clsx } from "@1771technologies/js-utils";
import { SortButton } from "./sort-button";

export const iconCls = css`
  position: absolute;
`;

export function HeaderCellDefault({ column, api }: ColumnHeaderRendererParamsReact<any>) {
  const sx = api.getState();
  const base = sx.columnBase.use();

  const justify = useMemo(() => {
    const s =
      column.headerJustify ?? base.headerJustify ?? (column.type === "number" ? "end" : "start");

    if (s === "end") return "flex-end";
    if (s === "center") return "center";
    return "flex-start";
  }, [base.headerJustify, column.headerJustify, column.type]);

  const columnMenu = sx.columnMenuRenderer.use();
  const hasColumnMenu = columnMenu && (column.columnMenuPredicate ?? base.columnMenuPredicate);

  const [el, setEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!el || !hasColumnMenu) return;
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
  }, [api, column, el, hasColumnMenu]);

  return (
    <div
      role={hasColumnMenu ? "button" : undefined}
      ref={setEl}
      style={{ justifyContent: justify }}
      className={clsx(
        css`
          display: flex;
          align-items: center;
          box-sizing: border-box;
          height: 100%;
          border-radius: 4px;
          transition: background-color ${t.transitions.normal} ${t.transitions.fn};

          padding-inline: 12px;

          .${iconCls} {
            opacity: 0;
          }

          &:hover .${iconCls} {
            opacity: 1;
          }
        `,
        hasColumnMenu &&
          css`
            &:hover {
              background-color: ${t.headerBgHover};
            }
          `,
      )}
    >
      <HeaderLabel api={api} column={column} justify={justify} />

      {api.columnIsSortable(column) && <SortButton api={api} column={column} justify={justify} />}
    </div>
  );
}
