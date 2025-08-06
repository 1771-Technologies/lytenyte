import type { CellSelectionRectPro } from "@1771technologies/grid-types/pro";
import type { InternalAtoms } from "../state/+types";
import type { Grid } from "../+types";
import { getRootCell } from "./get-root-cell";

export function expandCellSelectionStart(
  grid: Grid<any> & { internal: InternalAtoms },
  meta: boolean,
) {
  const selections = grid.state.cellSelections.get();
  const cellSelectionPivot = grid.internal.cellSelectionPivot.get();

  const rect = selections.at(-1);
  const pivot = cellSelectionPivot;

  if (!rect || !pivot) return;

  if (meta) {
    if (pivot.columnStart === 0) return;

    const next = { ...rect, columnStart: 0, columnEnd: pivot.columnEnd };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;

    grid.state.cellSelections.set(nextSelections);
    return;
  }

  let next: CellSelectionRectPro;
  let focusColumn;
  if (rect.columnEnd > pivot.columnEnd) {
    let colOffset = 1;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = getRootCell(grid, i, rect.columnEnd - 1);
      if (cell) colOffset = Math.max(colOffset, cell.colSpan);
    }

    focusColumn = rect.columnEnd - colOffset;
    next = { ...rect, columnEnd: focusColumn };
    focusColumn -= 1;
  } else {
    focusColumn = rect.columnStart - 1;
    next = { ...rect, columnStart: focusColumn };
  }

  grid.api.scrollIntoView({ column: focusColumn });

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;

  grid.state.cellSelections.set(nextSelections);
}
