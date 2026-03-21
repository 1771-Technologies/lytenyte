import type { PositionGridCell, PositionUnion } from "../types.js";
import { isFullyWithinRect } from "./is-fully-within-rect.js";
import { rectFromGridCellPosition } from "./rect-from-grid-cell-position.js";
import { rectsOverlap } from "./rects-overlap.js";
import type { DataRect } from "./types.js";

export function expandRectsDown(
  scrollIntoView: (params: { row?: number; column?: number }) => void,
  cellRoot: (row: number, column: number) => PositionUnion | null,
  selections: DataRect[],
  meta: boolean,
  position: PositionGridCell,
  rowCount: number,
): DataRect[] | null {
  const pos = rectFromGridCellPosition(position);

  const rect = selections.at(-1);
  if (!rect || !rectsOverlap(rect, pos) || isFullyWithinRect(pos, rect)) return null;

  if (meta) {
    const next: DataRect = { ...rect, rowEnd: rowCount, rowStart: pos.rowStart };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;
    if (pos.rowStart !== 0) scrollIntoView({ row: rowCount - 1 });

    return nextSelections;
  }

  const isAtEdge = pos.rowStart == rect.rowStart || pos.rowEnd === rect.rowEnd;

  let pivotStart = pos.rowStart;
  let pivotEnd = pos.rowEnd;
  // Our cell some how is spanned over. so for the current rowIndex, find the maximum span along the columns
  if (!isAtEdge) {
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(pos.rowStart, i) as PositionGridCell);
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
      const cell = rectFromGridCellPosition(cellRoot(rect.rowStart + 1, i) as PositionGridCell);

      if (cell.rowStart > highestRowEnd) {
        setCell = cell;
        highestRowEnd = cell.rowStart;
      }
    }

    scrollIntoView({ row: highestRowEnd });
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
        const cell = rectFromGridCellPosition(cellRoot(rect.rowEnd, i) as PositionGridCell);
        highestRowEnd = Math.max(cell.rowEnd, highestRowEnd);

        if (cell.rowEnd > highestRowEnd) {
          setCell = cell;
          highestRowEnd = cell.rowEnd;
        }
      }
    }

    scrollIntoView({ row: highestRowEnd - 1 });
    next = {
      ...rect,
      rowEnd: highestRowEnd,

      columnStart: Math.min(setCell.columnStart, rect.columnStart),
      columnEnd: Math.max(setCell.columnEnd, rect.columnEnd),
    };
  }

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;

  return nextSelections;
}
