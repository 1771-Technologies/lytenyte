import type { PositionGridCell } from "@1771technologies/lytenyte-shared";
import type { API, DataRect } from "../types/api.js";
import { dataRectFromCellPosition } from "./data-rect-from-cell-position.js";
import { isOverlappingRect } from "./is-overlapping-rect.js";

export function expandSelectionUp(
  api: API,
  selections: DataRect[],
  setSelections: (d: DataRect[]) => void,
  meta: boolean,
  position: PositionGridCell,
) {
  const pos = dataRectFromCellPosition(position);

  const rect = selections.at(-1);
  if (!rect || !isOverlappingRect(rect, pos)) return;

  if (meta) {
    const next: DataRect = { ...rect, rowStart: 0, rowEnd: pos.rowStart + 1 };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;
    setSelections(nextSelections);

    api.scrollIntoView({ row: 0 });
    return;
  }

  const isAtEdge = pos.rowStart == rect.rowStart || pos.rowEnd === rect.rowEnd;

  let pivotStart = pos.rowStart;
  let pivotEnd = pos.rowEnd;
  // Our cell some how is spanned over. so for the current rowIndex, find the maximum span along the columns
  if (!isAtEdge) {
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = dataRectFromCellPosition(api.cellRoot(pos.rowStart, i) as PositionGridCell);
      pivotStart = Math.min(pivotStart, cell.rowStart);
      pivotEnd = Math.max(pivotEnd, cell.rowEnd);
    }
  }

  let next: DataRect;
  if (rect.rowEnd > pivotEnd) {
    let lowestRowStart = Infinity;
    let c = rect;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = dataRectFromCellPosition(api.cellRoot(rect.rowEnd - 1, i) as PositionGridCell);
      lowestRowStart = Math.min(cell.rowStart, lowestRowStart);
      if (cell.rowStart < lowestRowStart) {
        lowestRowStart = cell.rowStart;
        c = cell;
      }
    }

    api.scrollIntoView({ row: lowestRowStart - 1 });
    next = {
      ...rect,
      rowEnd: lowestRowStart,

      columnStart: Math.min(c.columnStart, rect.columnStart),
      columnEnd: Math.max(c.columnEnd, rect.columnEnd),
    };
  } else {
    if (rect.rowStart === 0) return;

    let lowestRowStart = Infinity;
    let c = rect;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = dataRectFromCellPosition(api.cellRoot(rect.rowStart - 1, i) as PositionGridCell);
      lowestRowStart = Math.min(cell.rowStart, lowestRowStart);
      if (cell.rowStart < lowestRowStart) {
        lowestRowStart = cell.rowStart;
        c = cell;
      }
    }

    api.scrollIntoView({ row: lowestRowStart });
    next = {
      ...rect,
      rowStart: lowestRowStart,
      columnStart: Math.min(c.columnStart, rect.columnStart),
      columnEnd: Math.max(c.columnEnd, rect.columnEnd),
    };
  }

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;
  setSelections(nextSelections);
  return;
}
