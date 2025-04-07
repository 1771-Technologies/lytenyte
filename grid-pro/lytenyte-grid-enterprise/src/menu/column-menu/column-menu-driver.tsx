import { useGrid } from "../../use-grid";
import { Menu } from "@base-ui-components/react/menu";
import { useEffect, useState } from "react";

export const emptyBB = {
  getBoundingClientRect: (): DOMRect => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    toJSON: () => "",
  }),
};

export function ColumnMenuDriver() {
  const grid = useGrid();

  const menuColumn = grid.state.internal.columnMenuColumn.use();
  const target = grid.state.internal.columnMenuTarget.use();

  const MenuRenderer = grid.state.columnMenuRenderer.use();

  const [open, setOpen] = useState(false);

  // This is a little convoluted but essentially we want to separate the open
  // state from the menu state. From LyteNyte's perspective the menu is only
  // closed from the point of transition
  useEffect(() => {
    if (menuColumn == null || target == null) {
      setOpen(false);
      return;
    }

    setOpen(true);
  }, [menuColumn, target]);

  return (
    <Menu.Root
      open={open}
      onOpenChange={(c) => {
        setOpen(c);
      }}
      onOpenChangeComplete={(c) => {
        if (!c) grid.api.columnMenuClose();
      }}
    >
      <Menu.Portal>
        <Menu.Positioner
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
          {MenuRenderer && menuColumn && <MenuRenderer api={grid.api} column={menuColumn} />}
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
