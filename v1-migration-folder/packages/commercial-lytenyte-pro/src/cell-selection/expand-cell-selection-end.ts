import type { DataRect, Grid } from "../+types";
import type { InternalAtoms } from "../state/+types";
import { getRootCell } from "./get-root-cell";

export function expandCellSelectionEnd(
  grid: Grid<any> & { internal: InternalAtoms },
  ref?: DataRect,
  p?: DataRect,
) {
  const selections = grid.state.cellSelections.get();
  const cellSelectionPivot = grid.internal.cellSelectionPivot.get();

  const rect = ref ?? selections.at(-1);
  const pivot = p ?? cellSelectionPivot;

  if (!rect || !pivot) return;

  let next: DataRect;
  if (rect.columnStart < pivot.columnStart) {
    let colOffset = 1;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = getRootCell(grid, i, rect.columnStart);
      if (cell) colOffset = Math.max(colOffset, cell.colSpan);
    }

    next = { ...rect, columnStart: rect.columnStart + colOffset };
  } else {
    next = { ...rect, columnEnd: rect.columnEnd + 1 };
  }

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;

  grid.state.cellSelections.set(nextSelections);
}
