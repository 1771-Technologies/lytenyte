import type { Grid } from "../+types";
import type { InternalAtoms } from "../state/+types";

export function beginEditing<T>(
  grid: Grid<T> & { internal: InternalAtoms },
  activator?: "single" | "double-click",
  init?: any,
) {
  const focusPos = grid.internal.focusActive.get();
  const editMode = grid.state.editCellMode.get();
  const editActivator = grid.state.editClickActivator.get();
  if (focusPos?.kind !== "cell" || editMode === "readonly") return;
  if (activator && editActivator !== activator) return;

  const column = grid.api.columnByIndex(focusPos.colIndex);
  if (!column) return;
  if (grid.api.editIsCellActive({ column, rowIndex: focusPos.rowIndex })) return;

  grid.api.editBegin({ column, rowIndex: focusPos.rowIndex, init });
}
