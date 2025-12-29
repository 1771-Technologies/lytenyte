import type { API, DataRect } from "../types/api.js";
import { getRootCell } from "./get-root-cell.js";

export function expandCellSelectionDown(
  api: API,
  cellSelections: DataRect[],
  setCellSelections: (d: DataRect[]) => void,
  pivot: DataRect | null,
  rowCount: number,
  meta: boolean,
) {
  const rect = cellSelections.at(-1);

  if (!rect || !pivot) return;

  if (meta) {
    if (pivot.rowStart === rowCount - 1) return;

    const next = { ...rect, rowStart: pivot.rowStart, rowEnd: rowCount };
    const nextSelections = [...cellSelections];
    nextSelections[nextSelections.length - 1] = next;

    setCellSelections(nextSelections);
    return;
  }

  let next: DataRect;
  let focusRow;
  if (rect.rowStart < pivot.rowStart) {
    let rowOffset = 1;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = getRootCell(api.cellRoot, rect.rowStart, i);
      if (cell) rowOffset = Math.max(rowOffset, cell.rowSpan);
    }

    focusRow = rect.rowStart + rowOffset;
    next = { ...rect, rowStart: focusRow };
  } else {
    focusRow = rect.rowEnd + 1;
    next = { ...rect, rowEnd: focusRow };
    focusRow -= 1;
  }

  api.scrollIntoView({ row: focusRow });

  const nextSelections = [...cellSelections];
  nextSelections[nextSelections.length - 1] = next;

  setCellSelections(nextSelections);
}
