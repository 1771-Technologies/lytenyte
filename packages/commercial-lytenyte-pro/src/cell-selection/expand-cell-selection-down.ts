import type { DataRect, Grid } from "../+types.js";
import type { InternalAtoms } from "../state/+types.js";
import { getRootCell } from "./get-root-cell.js";

export function expandCellSelectionDown(
  grid: Grid<any> & { internal: InternalAtoms },
  meta: boolean,
) {
  const cellSelections = grid.state.cellSelections.get();
  const rect = cellSelections.at(-1);
  const pivot = grid.internal.cellSelectionPivot.get();

  if (!rect || !pivot) return;

  if (meta) {
    const rowCount = grid.state.rowDataStore.rowCount.get();
    if (pivot.rowStart === rowCount - 1) return;

    const next = { ...rect, rowStart: pivot.rowStart, rowEnd: rowCount };
    const nextSelections = [...cellSelections];
    nextSelections[nextSelections.length - 1] = next;

    grid.state.cellSelections.set(nextSelections);
    return;
  }

  let next: DataRect;
  let focusRow;
  if (rect.rowStart < pivot.rowStart) {
    let rowOffset = 1;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = getRootCell(grid, rect.rowStart, i);
      if (cell) rowOffset = Math.max(rowOffset, cell.rowSpan);
    }

    focusRow = rect.rowStart + rowOffset;
    next = { ...rect, rowStart: focusRow };
  } else {
    focusRow = rect.rowEnd + 1;
    next = { ...rect, rowEnd: focusRow };
    focusRow -= 1;
  }

  grid.api.scrollIntoView({ row: focusRow });

  const nextSelections = [...cellSelections];
  nextSelections[nextSelections.length - 1] = next;

  grid.state.cellSelections.set(nextSelections);
}
