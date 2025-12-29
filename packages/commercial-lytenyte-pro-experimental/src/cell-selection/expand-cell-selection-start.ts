import type { API, DataRect } from "../types/api.js";
import { getRootCell } from "./get-root-cell.js";

export function expandCellSelectionStart(
  api: API,
  selections: DataRect[],
  cellSelectionPivot: DataRect | null,
  setSelections: (d: DataRect[]) => void,
  meta: boolean,
) {
  const rect = selections.at(-1);
  const pivot = cellSelectionPivot;

  if (!rect || !pivot) return;

  if (meta) {
    if (pivot.columnStart === 0) return;

    const next = { ...rect, columnStart: 0, columnEnd: pivot.columnEnd };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;

    setSelections(nextSelections);
    return;
  }

  let next: DataRect;
  let focusColumn;
  if (rect.columnEnd > pivot.columnEnd) {
    let colOffset = 1;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = getRootCell(api.cellRoot, i, rect.columnEnd - 1);
      if (cell) colOffset = Math.max(colOffset, cell.colSpan);
    }

    focusColumn = rect.columnEnd - colOffset;
    next = { ...rect, columnEnd: focusColumn };
    focusColumn -= 1;
  } else {
    focusColumn = rect.columnStart - 1;
    next = { ...rect, columnStart: focusColumn };
  }

  api.scrollIntoView({ column: focusColumn });

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;

  setSelections(nextSelections);
}
