import type {
  ApiEnterpriseReact,
  ColumnBaseEnterpriseReact,
  ColumnEnterpriseReact,
} from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { PillRowItem } from "./pill-row-elements";
import { useEvent } from "@1771technologies/react-utils";
import { t } from "@1771technologies/grid-design";
import { DotsIcon } from "../icons/dots-icon";

export function useColumnPills(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();

  const columns = sx.columns.use();
  const base = sx.columnBase.use();

  const gridId = sx.gridId.use();

  const pillItems = useMemo(() => {
    const hidden: ColumnEnterpriseReact<any>[] = [];
    const visible: ColumnEnterpriseReact<any>[] = [];

    const normalColumns = columns.filter((c) => !api.columnIsGridGenerated(c));

    for (let i = 0; i < normalColumns.length; i++) {
      const c = normalColumns[i];
      if (c.hide ?? base.hide ?? false) hidden.push(c);
      else visible.push(c);
    }

    const merged = [
      ...visible.map<PillRowItem>((c) => {
        return {
          column: c,
          id: c.id,
          kind: "column",
          inactive: false,
          labelRenderer: Renderer,
          endContent: <MenuContent api={api} base={base} column={c} />,

          dragTag: `${gridId}:column:${c.pin ? c.pin : "none"}`,
          dropTag: `${gridId}:column:${c.pin ? c.pin : "none"}`,
        };
      }),
      ...hidden.map<PillRowItem>((c) => {
        return {
          column: c,
          id: c.id,
          kind: "column",
          inactive: true,
          labelRenderer: Renderer,

          dragTag: `${gridId}:column:${c.pin ? c.pin : "none"}`,
          dropTag: `${gridId}:column:${c.pin ? c.pin : "none"}`,
        };
      }),
    ];

    const expanded = normalColumns.map<PillRowItem>((c) => {
      const inactive = c.hide ?? base.hide ?? false;
      return {
        column: c,
        id: c.id,
        kind: "column",
        inactive,
        labelRenderer: Renderer,
        endContent: inactive ? null : <MenuContent api={api} base={base} column={c} />,

        dragTag: `${gridId}:column:${c.pin ? c.pin : "none"}`,
        dropTag: `${gridId}:column:${c.pin ? c.pin : "none"}`,
      };
    });

    return { merged, expanded };
  }, [api, base, columns, gridId]);

  const onPillSelect = useEvent((p: PillRowItem) => {
    if (!api.columnIsHidable(p.column)) return;

    const nextState = !(p.column.hide ?? base.hide ?? false);

    api.columnUpdate(p.column, { hide: nextState });
  });

  const onDrop = useEvent((dragged: PillRowItem, over: PillRowItem, isBefore: boolean) => {
    const src = dragged.id;
    const target = over.id;
    if (src === target) return;

    if (isBefore) api.columnMoveBefore([src], target);
    else api.columnMoveAfter([src], target);
  });

  return {
    pillItems: pillItems.merged,
    expandedPillItems: pillItems.expanded,
    onPillSelect,
    onDrop,
  };
}

const MenuContent = (p: {
  column: ColumnEnterpriseReact<any>;
  base: ColumnBaseEnterpriseReact<any>;
  api: ApiEnterpriseReact<any>;
}) => {
  const columnMenu = p.column.columnMenuGetItems ?? p.base.columnMenuGetItems;
  if (!columnMenu) return null;

  return (
    <button
      className={css`
        width: 20px;
        height: 20px;
        padding: 0px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: ${t.colors.borders_icons_default};
        cursor: pointer;
        border-radius: ${t.spacing.box_radius_regular};
        &:hover {
          background-color: ${t.colors.backgrounds_button_light};
        }
      `}
      tabIndex={-1}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        p.api.columnMenuOpen(p.column, e.currentTarget);
      }}
    >
      <DotsIcon width={16} height={16} />
    </button>
  );
};

const Renderer = ({
  api,
  item: { column },
}: {
  item: PillRowItem;
  api: ApiEnterpriseReact<any>;
}) => {
  const sx = api.getState();
  const base = sx.columnBase.use();
  const hasRowGroup = sx.rowGroupModel.use().length > 0;

  const aggFunc = column.aggFunc ?? base.aggFunc;
  const name = typeof aggFunc === "string" ? `(${aggFunc})` : `Fn(x)`;

  if (!hasRowGroup || !aggFunc) return column.headerName ?? column.id;

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        gap: ${t.spacing.space_05};
      `}
    >
      <span>{column.headerName ?? column.id}</span>
      <span
        className={css`
          color: ${t.colors.primary_50};
        `}
      >
        {name}
      </span>
    </div>
  );
};
