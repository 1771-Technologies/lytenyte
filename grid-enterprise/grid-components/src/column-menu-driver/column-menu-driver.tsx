import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useGrid } from "../provider/grid-provider";
import type {
  ColumnMenuItemLeaf,
  ColumnMenuParent,
  Target,
} from "@1771technologies/grid-types/enterprise";
import { LngPopover } from "../popover/lng-popover";
import { clsx } from "@1771technologies/js-utils";
import { useEffect, useMemo, useState } from "react";
import {
  MenuRoot,
  type MenuAxe,
  type MenuItem,
  type MenuItemLeaf,
  type MenuParent,
} from "@1771technologies/react-menu-legacy";
import { t } from "@1771technologies/grid-design";
import { cc } from "../component-configuration";

export const ColumnMenuDriver = () => {
  const grid = useGrid();
  const menuColumn = grid.state.internal.columnMenuColumn.use();
  const target = grid.state.internal.columnMenuTarget.use();

  if (!menuColumn || !target) return;

  return <ColumnMenuDriverImpl menuColumn={menuColumn} target={target} />;
};

export interface ColumnMenuConfiguration {
  readonly axe?: MenuAxe;
}

function ColumnMenuDriverImpl({
  menuColumn,
  target,
}: {
  menuColumn: ColumnEnterpriseReact<any>;
  target: Target;
}) {
  const grid = useGrid();
  const base = grid.state.columnBase.use();

  const menuState = grid.state.columnMenuState.use();
  const getMenuItems = menuColumn.columnMenuGetItems ?? base.columnMenuGetItems;

  const menuItems = useMemo<MenuItem[]>(() => {
    if (!getMenuItems) return [];

    const wrap = (menuItem: MenuItem): MenuItem => {
      if (menuItem.kind === "item")
        return {
          ...menuItem,
          action: (s) => {
            menuItem.action(s);
            grid.api.columnMenuClose();
          },
        } satisfies MenuItemLeaf;

      if (menuItem.kind === "submenu") {
        return { ...menuItem, children: menuItem.children.map(wrap) };
      }

      return menuItem;
    };

    return getMenuItems(grid.api).map(wrap);
  }, [getMenuItems, grid.api]);

  const config = cc.columnMenu.use();

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isOpen) return;
    grid.api.columnMenuClose();
  }, [grid.api, isOpen]);

  return (
    <>
      {!getMenuItems && (
        <LngPopover open onOpenChange={() => setIsOpen(false)} popoverTarget={target}>
          <div
            className={clsx(
              "lng1771-text-medium",

              css`
                width: 200px;
                height: 50px;
                display: flex;
                text-align: center;
                align-items: center;
                justify-content: center;
              `,
            )}
          >
            This column does not have a menu
          </div>
        </LngPopover>
      )}
      {getMenuItems && (
        <LngPopover
          open
          onOpenChange={() => setIsOpen(false)}
          popoverTarget={target}
          placement="bottom"
        >
          <MenuRoot
            menuItems={menuItems}
            ariaLabelledBy={"clientHeight" in target ? (target.id ?? "") : ""}
            axe={config.axe!}
            state={menuState}
            rtl={grid.state.rtl.use()}
            rendererItem={MenuItemRenderer}
            rendererParent={MenuParentRenderer}
            classes={{
              base: clsx(
                "lng1771-text-medium",
                css`
                  display: flex;
                  align-items: center;
                  padding-inline-start: ${t.spacing.space_25};
                  padding-inline-end: ${t.spacing.space_20};
                  padding-block: ${t.spacing.space_10};
                  min-width: 150px;
                  border-radius: ${t.spacing.box_radius_medium};
                  cursor: pointer;
                  &:hover {
                    background-color: ${t.colors.backgrounds_light};
                  }
                  &:focus-visible {
                    outline: none;
                    background-color: ${t.colors.backgrounds_light};
                  }
                `,
              ),
              parentMenu: css`
                background-color: ${t.colors.backgrounds_context_menu};
                border: 1px solid ${t.colors.borders_context_menu};
                border-radius: ${t.spacing.box_radius_large};
                padding: ${t.spacing.space_05};

                box-shadow: ${t.shadows[400]};

                &:focus {
                  outline: none;
                }

                &::backdrop {
                  background-color: transparent;
                }
              `,
              separator: css`
                background-color: ${t.colors.borders_separator};
                height: 1px;
                margin-block: ${t.spacing.space_02};
              `,
            }}
          />
        </LngPopover>
      )}
    </>
  );
}

export const MenuItemRenderer = (p: MenuItemLeaf) => {
  const props = p as ColumnMenuItemLeaf;
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        gap: ${t.spacing.space_20};
      `}
    >
      <div
        className={css`
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: ${t.colors.borders_icons_default};
        `}
      >
        {props.icon && <props.icon />}
      </div>
      <div
        className={clsx(
          "lng1771-text-medium",
          css`
            flex: 1;
          `,
        )}
      >
        {props.label}
      </div>
      <div>{props.endIcon && <props.endIcon />}</div>
    </div>
  );
};

export const MenuParentRenderer = (p: MenuParent) => {
  const props = p as ColumnMenuParent;

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        gap: ${t.spacing.space_20};
        width: 100%;
      `}
    >
      <div
        className={css`
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: ${t.colors.borders_icons_default};
        `}
      >
        {props.icon && <props.icon />}
      </div>
      <div
        className={clsx(
          "lng1771-text-medium",
          css`
            flex: 1;
          `,
        )}
      >
        {props.label}
      </div>
      <div>
        <span
          className={css`
            position: relative;
            font-size: 20px;
          `}
        >
          ›
        </span>
      </div>
    </div>
  );
};
