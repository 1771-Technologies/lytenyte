import type { CellSelectionRectPro } from "@1771technologies/grid-types/pro";
import type { InternalAtoms } from "../state/+types";
import type { DataRect, Grid } from "../+types";
import { getRootCell } from "./get-root-cell";

export function expandCellSelectionUp(
  grid: Grid<any> & { internal: InternalAtoms },
  ref?: DataRect,
  p?: DataRect,
) {
  const selections = grid.state.cellSelections.get();
  const cellSelectionPivot = grid.internal.cellSelectionPivot.get();

  const rect = ref ?? selections.at(-1);
  const pivot = p ?? cellSelectionPivot;

  if (!rect || !pivot) return;

  let next: CellSelectionRectPro;
  if (rect.rowEnd > pivot.rowEnd) {
    let rowOffset = 1;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = getRootCell(grid, rect.rowEnd - 1, i);
      if (cell) rowOffset = Math.max(rowOffset, cell.rowSpan);
    }
    next = { ...rect, rowEnd: rect.rowEnd - rowOffset };
  } else {
    next = { ...rect, rowStart: rect.rowStart - 1 };
  }

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;

  grid.state.cellSelections.set(nextSelections);
}
