import type { InternalAtoms } from "../state/+types.js";
import type { DataRect, Grid } from "../+types.js";
import { getRootCell } from "./get-root-cell.js";

export function expandCellSelectionUp(grid: Grid<any> & { internal: InternalAtoms }, meta: boolean) {
  const selections = grid.state.cellSelections.get();
  const cellSelectionPivot = grid.internal.cellSelectionPivot.get();

  const rect = selections.at(-1)!;
  const pivot = cellSelectionPivot;

  if (!rect || !pivot) return;

  if (meta) {
    if (pivot.rowStart === 0) return;

    const next = { ...rect, rowEnd: pivot.rowEnd, rowStart: 0 } satisfies DataRect;

    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;

    grid.state.cellSelections.set(nextSelections);
    return;
  }

  let next: DataRect;
  let focusRow;
  if (rect.rowEnd > pivot.rowEnd) {
    let rowOffset = 1;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = getRootCell(grid, rect.rowEnd - 1, i);
      if (cell) rowOffset = Math.max(rowOffset, cell.rowSpan);
    }

    focusRow = rect.rowEnd - rowOffset;
    next = { ...rect, rowEnd: focusRow };
    focusRow -= 1;
  } else {
    focusRow = rect.rowStart - 1;
    next = { ...rect, rowStart: focusRow };
  }
  grid.api.scrollIntoView({ row: focusRow });

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;

  grid.state.cellSelections.set(nextSelections);
}
