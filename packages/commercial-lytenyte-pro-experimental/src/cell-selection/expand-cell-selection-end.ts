import type { ColumnView } from "@1771technologies/lytenyte-shared";
import type { API, DataRect } from "../types/api.js";
import { getRootCell } from "./get-root-cell.js";

export function expandCellSelectionEnd(
  api: API,
  view: ColumnView,
  selections: DataRect[],
  cellSelectionPivot: DataRect | null,
  setSelections: (d: DataRect[]) => void,
  meta: boolean,
) {
  const rect = selections.at(-1);
  const pivot = cellSelectionPivot;

  if (!rect || !pivot) return;

  if (meta) {
    const colCount = view.visibleColumns.length;
    if (pivot.columnStart === colCount - 1) return;

    const next = { ...rect, columnStart: pivot.columnStart, columnEnd: colCount };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;

    setSelections(nextSelections);
    return;
  }

  let next: DataRect;
  let focusColumn;
  if (rect.columnStart < pivot.columnStart) {
    let colOffset = 1;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = getRootCell(api.cellRoot, i, rect.columnStart);
      if (cell) colOffset = Math.max(colOffset, cell.colSpan);
    }

    focusColumn = rect.columnStart + colOffset;
    next = { ...rect, columnStart: focusColumn };
  } else {
    focusColumn = rect.columnEnd + 1;
    next = { ...rect, columnEnd: focusColumn };
    focusColumn -= 1;
  }

  api.scrollIntoView({ column: focusColumn });

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;

  setSelections(nextSelections);
}
