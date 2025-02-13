import type { ColumnMenuItem } from "@1771technologies/grid-types/enterprise";
import { type ContextMenuGridTargets, type Target } from "@1771technologies/grid-types/enterprise";
import { useGrid } from "../provider/grid-provider";
import { LngPopover } from "../popover/lng-popover";
import { useEffect, useState } from "react";
import { clsx, getClientX, getClientY } from "@1771technologies/js-utils";
import { getHoveredColumnIndex, getHoveredRowIndex } from "@1771technologies/grid-core";
import { MenuRoot, type MenuAxe } from "@1771technologies/react-menu-legacy";
import { MenuItemRenderer, MenuParentRenderer } from "../column-menu-driver/column-menu-driver";
import { t } from "@1771technologies/grid-design";
import { cc } from "../component-configuration";

export interface ContextMenuConfiguration {
  readonly axe?: MenuAxe;
}

export const ContextMenuDriver = () => {
  const grid = useGrid();
  const [menuItems, setMenuItems] = useState<ColumnMenuItem[]>([]);
  const context = grid.state.internal.contextMenuTarget.use();

  const viewport = grid.state.internal.viewport.use();
  const getItems = grid.state.contextMenuItems.use();

  useEffect(() => {
    if (!getItems || !viewport) return;

    const controller = new AbortController();
    viewport.addEventListener(
      "contextmenu",
      (e) => {
        if (e.ctrlKey || e.metaKey) return;

        if (context) {
          e.preventDefault();
          e.stopPropagation();
          grid.api.contextMenuClose();
          return;
        }

        const x = getClientX(e);
        const hoveredCell = getHoveredColumnIndex(grid.api, x);
        const y = getClientY(e);
        const hoveredRow = getHoveredRowIndex(grid.api, y);

        let target: ContextMenuGridTargets | null = hoveredRow != null ? "cell" : null;

        if (hoveredRow == null) {
          // lets determine the header section.
          let current = e.target as HTMLElement;
          while (
            current &&
            current.getAttribute("data-lng1771-kind") == null &&
            current !== viewport
          ) {
            current = current.parentElement as HTMLElement;
          }

          if (current && current !== viewport) {
            const kind = current.getAttribute("data-lng1771-kind");
            if (kind === "floating") target = "header-floating";
            if (kind === "header") target = "header";
            if (kind === "header-group") target = "header-group";
          }
        }

        if (!target || hoveredCell == null) return;

        const menuItems = getItems({
          api: grid.api,
          target,
          rowIndex: hoveredRow,
          columnIndex: hoveredCell,
        });

        if (!menuItems || menuItems.length === 0) return;

        e.stopPropagation();
        e.preventDefault();

        setMenuItems(menuItems!);

        const cellSelectionMode = grid.state.cellSelectionMode.peek();
        if (
          target === "cell" &&
          cellSelectionMode !== "none" &&
          !grid.api.cellSelectionIsSelected(hoveredRow!, hoveredCell)
        ) {
          grid.state.cellSelections.set([
            {
              rowStart: hoveredRow!,
              rowEnd: hoveredRow! + 1,
              columnStart: hoveredCell,
              columnEnd: hoveredCell + 1,
            },
          ]);
        }

        grid.state.internal.contextMenuTarget.set({ x: x, y, width: 1, height: 1 });
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [
    context,
    getItems,
    grid.api,
    grid.state.cellSelectionMode,
    grid.state.cellSelections,
    grid.state.internal.contextMenuTarget,
    viewport,
  ]);

  if (!context) return <></>;

  return <ContextMenuImpl target={context} menuItems={menuItems} />;
};

function ContextMenuImpl({ target, menuItems }: { target: Target; menuItems: ColumnMenuItem[] }) {
  const grid = useGrid();
  const config = cc.contextMenu.use();

  const contextMenuState = grid.state.contextMenuState.use();

  return (
    <LngPopover
      open
      onOpenChange={() => grid.api.columnMenuClose()}
      popoverTarget={target}
      placement="bottom"
    >
      <MenuRoot
        menuItems={menuItems}
        axe={config.axe!}
        ariaLabelledBy={"clientHeight" in target ? (target.id ?? "") : ""}
        state={contextMenuState}
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
  );
}
