import type { PositionGridCell } from "@1771technologies/lytenyte-shared";
import type { API, DataRect } from "../types/api.js";
import { dataRectFromCellPosition } from "./data-rect-from-cell-position.js";
import { isOverlappingRect } from "./is-overlapping-rect.js";
import { isFullyWithinRect } from "./is-fully-within-rect.js";

export function expandSelectionDown(
  api: API,
  selections: DataRect[],
  setSelections: (d: DataRect[]) => void,
  meta: boolean,
  position: PositionGridCell,
  rowCount: number,
) {
  const pos = dataRectFromCellPosition(position);

  const rect = selections.at(-1);
  if (!rect || !isOverlappingRect(rect, pos) || isFullyWithinRect(pos, rect)) return;

  if (meta) {
    const next: DataRect = { ...rect, rowEnd: rowCount, rowStart: pos.rowStart };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;
    setSelections(nextSelections);
    api.scrollIntoView({ row: rowCount - 1 });
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
  // Reduce our rect by one level
  if (rect.rowStart < pivotStart) {
    let highestRowEnd = -Infinity;
    let setCell: DataRect = rect;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = dataRectFromCellPosition(api.cellRoot(rect.rowStart + 1, i) as PositionGridCell);

      if (cell.rowStart > highestRowEnd) {
        setCell = cell;
        highestRowEnd = cell.rowStart;
      }
    }

    api.scrollIntoView({ row: highestRowEnd });
    next = {
      ...rect,
      rowStart: highestRowEnd,
      columnStart: Math.min(setCell.columnStart, rect.columnStart),
      columnEnd: Math.max(setCell.columnEnd, rect.columnEnd),
    };
  } else {
    // Move the rect level down by one.
    let highestRowEnd = -Infinity;
    let setCell: DataRect = rect;

    if (rect.rowEnd >= rowCount) {
      highestRowEnd = rowCount;
    } else {
      for (let i = rect.columnStart; i < rect.columnEnd; i++) {
        const cell = dataRectFromCellPosition(api.cellRoot(rect.rowEnd, i) as PositionGridCell);
        highestRowEnd = Math.max(cell.rowEnd, highestRowEnd);

        if (cell.rowEnd > highestRowEnd) {
          setCell = cell;
          highestRowEnd = cell.rowEnd;
        }
      }
    }

    api.scrollIntoView({ row: highestRowEnd - 1 });
    next = {
      ...rect,
      rowEnd: highestRowEnd,

      columnStart: Math.min(setCell.columnStart, rect.columnStart),
      columnEnd: Math.max(setCell.columnEnd, rect.columnEnd),
    };
  }

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;
  setSelections(nextSelections);
  return;
}
