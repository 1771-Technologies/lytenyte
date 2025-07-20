import type { DataRect, Grid } from "../+types";
import type { InternalAtoms } from "../state/+types";
import { getRootCell } from "./get-root-cell";

export function expandCellSelectionEnd(
  grid: Grid<any> & { internal: InternalAtoms },
  meta: boolean,
) {
  const selections = grid.state.cellSelections.get();
  const cellSelectionPivot = grid.internal.cellSelectionPivot.get();

  const rect = selections.at(-1);
  const pivot = cellSelectionPivot;

  if (!rect || !pivot) return;

  if (meta) {
    const colCount = grid.state.columnMeta.get().columnsVisible.length;
    if (pivot.columnStart === colCount - 1) return;

    const next = { ...rect, columnStart: pivot.columnStart, columnEnd: colCount };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;

    grid.state.cellSelections.set(nextSelections);
    return;
  }

  let next: DataRect;
  let focusColumn;
  if (rect.columnStart < pivot.columnStart) {
    let colOffset = 1;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = getRootCell(grid, i, rect.columnStart);
      if (cell) colOffset = Math.max(colOffset, cell.colSpan);
    }

    focusColumn = rect.columnStart + colOffset;
    next = { ...rect, columnStart: focusColumn };
  } else {
    focusColumn = rect.columnEnd + 1;
    next = { ...rect, columnEnd: focusColumn };
    focusColumn -= 1;
  }

  grid.api.scrollIntoView({ column: focusColumn });

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;

  grid.state.cellSelections.set(nextSelections);
}
