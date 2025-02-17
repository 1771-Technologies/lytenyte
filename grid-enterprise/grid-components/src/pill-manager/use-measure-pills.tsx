import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo, useRef, useState } from "react";
import type { PillRowItem } from "./pill-row-elements";
import { useEvent } from "@1771technologies/react-utils";
import { useDrop } from "./use-row-groups-pills";
import { t } from "@1771technologies/grid-design";
import type { MenuItem, MenuItemCheckbox } from "@1771technologies/react-menu-legacy";
import { PopoverMenu } from "../popover-menu/popover-menu";
import { clsx } from "@1771technologies/js-utils";

export function useMeasurePills(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();
  const columns = sx.columns.use();

  const model = sx.measureModel.use();

  const pillItems = useMemo(() => {
    const inModel = model.map((c) => api.columnById(c)!);
    const outOfModel = columns.filter((c) => api.columnIsMeasurable(c) && !model.includes(c.id));

    return [...inModel, ...outOfModel].map<PillRowItem>((c) => {
      const inactive = !model.includes(c.id);
      return {
        id: c.id,
        column: c,
        kind: "column",
        inactive,
        labelRenderer: inactive ? undefined : Renderer,
        dragTags: [],
        dropTags: [],
      };
    });
  }, [api, columns, model]);

  const onPillSelect = useEvent((p: PillRowItem) => {
    if (model.includes(p.id)) sx.measureModel.set((prev) => prev.filter((c) => c !== p.id));
    else sx.measureModel.set((prev) => [...prev, p.id]);
  });

  const onDrop = useDrop(model, sx.measureModel);

  return { pillItems, onPillSelect, onDrop };
}

function Renderer({ api, item: { column } }: { item: PillRowItem; api: ApiEnterpriseReact<any> }) {
  const sx = api.getState();
  const base = sx.columnBase.use();

  const aggFunc = column.measureFunc ?? base.measureFunc;
  const name = typeof aggFunc === "string" ? `(${aggFunc})` : `Fn(x)`;

  const allowed = column.measureFuncsAllowed ?? base.measureFuncsAllowed;
  const target = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);
  const menuItems = useMemo(() => {
    if (!allowed) return [];
    const items: MenuItem[] = allowed.map((c) => {
      return {
        checked: c === name,
        id: c,
        kind: "checkbox",
        label: c,
        onCheckChange: () => {
          api.columnUpdate(column, { measureFunc: c });
          setOpen(false);
        },
      } satisfies MenuItemCheckbox;
    });

    return items;
  }, [allowed, api, column, name]);

  const disabled = menuItems.length === 0;

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        gap: ${t.spacing.space_05};
      `}
    >
      <span>{column.headerName ?? column.id}</span>
      <button
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();

          setOpen(true);
        }}
        disabled={disabled}
        ref={target}
        className={clsx(
          css`
            display: flex;
            align-items: center;
            justify-content: center;
            padding-inline: ${t.spacing.space_02};
            font-size: ${t.typography.body_s};
            background-color: transparent;
            border: none;
            padding: 0px;
            color: ${t.colors.primary_50};
            padding-block: 2px;
            padding-inline: ${t.spacing.space_05};
            cursor: pointer;
            border-radius: ${t.spacing.box_radius_regular};

            &:hover:not(:disabled) {
              background-color: ${t.colors.backgrounds_button_light};
            }
          `,
          disabled &&
            css`
              color: ${t.colors.primary_70};
            `,
        )}
      >
        {name}
      </button>
      {target.current && (
        <PopoverMenu
          menuItems={menuItems}
          open={open}
          onOpenChange={setOpen}
          placement="bottom"
          popoverTarget={target.current}
        />
      )}
    </div>
  );
}
