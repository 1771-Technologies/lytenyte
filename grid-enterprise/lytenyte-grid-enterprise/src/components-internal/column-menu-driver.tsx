import { ControlledMenu } from "@1771technologies/react-menu";
import { useGrid } from "../use-grid";

export function ColumnMenuDriver() {
  const grid = useGrid();

  const menuColumn = grid.state.internal.columnMenuColumn.use();
  const target = grid.state.internal.columnMenuTarget.use();

  const MenuRenderer = grid.state.columnMenuRenderer.use();

  if (!MenuRenderer || menuColumn == null || target == null) return null;

  return (
    <ControlledMenu
      state={target ? "open" : "closed"}
      submenuCloseDelay={20}
      onClose={() => {
        const current = target;
        setTimeout(() => {
          if (current instanceof HTMLElement) current.focus();
        }, 20);

        grid.api.columnMenuClose();
      }}
      anchorRef={target instanceof HTMLElement ? { current: target } : undefined}
      anchorPoint={!(target instanceof HTMLElement) ? target : undefined}
      portal
    >
      <MenuRenderer api={grid.api} column={menuColumn} />
    </ControlledMenu>
  );
}
