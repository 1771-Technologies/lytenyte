import { useEffect, useState } from "react";
import { useGrid } from "../../use-grid";
import { useContextMenuListener } from "./use-context-menu-listener";
import { Menu } from "@base-ui-components/react/menu";
import type { ContextMenuGridTargetsProReact } from "@1771technologies/grid-types/pro-react";
import { AnchorProvider } from "../../anchor-context/anchor-context";

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

  const soft = !!(
    menu?.hoveredRow != null &&
    menu.hoveredColumn != null &&
    grid.api.cellSelectionIsSelected(menu.hoveredRow, menu.hoveredColumn)
  );

  return (
    <Menu.Root
      open={open}
      onOpenChange={(c) => {
        setOpen(c);
      }}
      onOpenChangeComplete={(c) => {
        if (c) {
          grid.state.internal.cellSelectionSoftFocus.set(soft);
        }
        if (!c) {
          grid.api.contextMenuClose();
          setMenu(null);
        }
      }}
    >
      <Menu.Portal>
        <AnchorProvider anchor={target}>
          {menu && MenuRenderer && (
            <MenuRenderer
              api={grid.api}
              menuTarget={menu.menuTarget}
              columnIndex={menu.hoveredColumn}
              rowIndex={menu.hoveredRow}
            />
          )}
        </AnchorProvider>
      </Menu.Portal>
    </Menu.Root>
  );
}
