import type { PositionGridCell, PositionUnion } from "../types";
import { isFullyWithinRect } from "./is-fully-within-rect.js";
import { rectFromGridCellPosition } from "./rect-from-grid-cell-position.js";
import { rectsOverlap } from "./rects-overlap.js";
import type { DataRect } from "./types";

export function expandRectsUp(
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
    const next: DataRect = { ...rect, rowStart: 0, rowEnd: pos.rowStart + 1 };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;

    if (pos.rowStart !== rowCount - 1) scrollIntoView({ row: 0 });
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
  if (rect.rowEnd > pivotEnd) {
    let lowestRowStart = Infinity;
    let c = rect;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(rect.rowEnd - 1, i) as PositionGridCell);
      lowestRowStart = Math.min(cell.rowStart, lowestRowStart);
      if (cell.rowStart < lowestRowStart) {
        lowestRowStart = cell.rowStart;
        c = cell;
      }
    }

    scrollIntoView({ row: lowestRowStart - 1 });
    next = {
      ...rect,
      rowEnd: lowestRowStart,

      columnStart: Math.min(c.columnStart, rect.columnStart),
      columnEnd: Math.max(c.columnEnd, rect.columnEnd),
    };
  } else {
    if (rect.rowStart === 0) return null;

    let lowestRowStart = Infinity;
    let c = rect;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(rect.rowStart - 1, i) as PositionGridCell);
      lowestRowStart = Math.min(cell.rowStart, lowestRowStart);
      if (cell.rowStart < lowestRowStart) {
        lowestRowStart = cell.rowStart;
        c = cell;
      }
    }

    scrollIntoView({ row: lowestRowStart });
    next = {
      ...rect,
      rowStart: lowestRowStart,
      columnStart: Math.min(c.columnStart, rect.columnStart),
      columnEnd: Math.max(c.columnEnd, rect.columnEnd),
    };
  }

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;
  return nextSelections;
}
