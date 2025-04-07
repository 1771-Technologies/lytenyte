import { useEffect, useState } from "react";
import { useGrid } from "../../use-grid";
import { useContextMenuListener } from "./use-context-menu-listener";
import { Menu } from "@base-ui-components/react/menu";
import { emptyBB } from "../column-menu/column-menu-driver";
import type { ContextMenuGridTargetsProReact } from "@1771technologies/grid-types/pro-react";

export function ContextMenuDriver() {
  const grid = useGrid();

  const [menu, setMenu] = useState<{
    hoveredRow: number | null;
    hoveredColumn: number | null;
    menuTarget: ContextMenuGridTargetsProReact;
  } | null>(null);

  const MenuRenderer = grid.state.contextMenuRenderer.use();

  const target = grid.state.internal.contextMenuTarget.use();

  useContextMenuListener(setMenu);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (menu !== null) {
      setOpen(true);
    }
  }, [menu]);

  return (
    <Menu.Root
      open={open}
      onOpenChange={(c) => {
        setOpen(c);
      }}
      onOpenChangeComplete={(c) => {
        if (!c) {
          grid.api.contextMenuClose();
          setMenu(null);
        }
      }}
    >
      <Menu.Portal>
        <Menu.Positioner
          side="bottom"
          align="start"
          anchor={
            target
              ? "getBoundingClientRect" in target
                ? target
                : {
                    getBoundingClientRect: () => ({
                      x: target.x,
                      y: target.y,
                      width: target.width,
                      height: target.height,
                      top: target.y,
                      left: target.x,
                      bottom: target.y,
                      right: target.x,
                      toJSON: () => "",
                    }),
                  }
              : emptyBB
          }
        >
          {menu && MenuRenderer && (
            <MenuRenderer
              api={grid.api}
              menuTarget={menu.menuTarget}
              columnIndex={menu.hoveredColumn}
              rowIndex={menu.hoveredRow}
            />
          )}
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
