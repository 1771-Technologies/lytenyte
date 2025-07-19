import type { DataRect, Grid } from "../+types";
import type { InternalAtoms } from "../state/+types";
import { getRootCell } from "./get-root-cell";

export function expandCellSelectionDown(
  grid: Grid<any> & { internal: InternalAtoms },
  ref?: DataRect,
  p?: DataRect,
) {
  const cellSelections = grid.state.cellSelections.get();
  const rect = ref ?? cellSelections.at(-1);
  const pivot = p ?? grid.internal.cellSelectionPivot.get();

  if (!rect || !pivot) return;

  let next: DataRect;
  if (rect.rowStart < pivot.rowStart) {
    let rowOffset = 1;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = getRootCell(grid, rect.rowStart, i);
      if (cell) rowOffset = Math.max(rowOffset, cell.rowSpan);
    }

    next = { ...rect, rowStart: rect.rowStart + rowOffset };
  } else {
    next = { ...rect, rowEnd: rect.rowEnd + 1 };
  }

  const nextSelections = [...cellSelections];
  nextSelections[nextSelections.length - 1] = next;

  grid.state.cellSelections.set(nextSelections);
}
