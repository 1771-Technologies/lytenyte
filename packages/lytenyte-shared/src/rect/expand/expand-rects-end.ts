import type { ColumnView } from "../../columns/index.js";
import type { PositionGridCell, PositionUnion } from "../../types.js";
import { isFullyWithinRect } from "./is-fully-within-rect.js";
import { rectFromGridCellPosition } from "../rect-from-grid-cell-position.js";
import { rectsOverlap } from "./rects-overlap.js";
import type { DataRect } from "../types.js";

export function expandRectsEnd(
  scrollIntoView: (params: { row?: number; column?: number }) => void,
  cellRoot: (row: number, column: number) => PositionUnion | null,
  selections: DataRect[],
  meta: boolean,
  position: PositionGridCell,
  view: ColumnView,
): DataRect[] | null {
  const pos = rectFromGridCellPosition(position);
  const rect = selections.at(-1);
  if (!rect || !rectsOverlap(rect, pos) || isFullyWithinRect(pos, rect)) return null;

  if (meta) {
    const next: DataRect = {
      ...rect,
      columnStart: pos.columnStart,
      columnEnd: view.visibleColumns.length,
    };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;

    if (pos.columnStart !== 0) scrollIntoView({ column: view.visibleColumns.length - 1 });

    return nextSelections;
  }

  const isAtEdge = pos.columnStart == rect.columnStart || pos.columnEnd === rect.columnEnd;

  let pivotStart = pos.columnStart;
  let pivotEnd = pos.columnEnd;

  // Our cell some how is spanned over. so for the current rowIndex, find the maximum span along the columns
  if (!isAtEdge) {
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(i, pos.columnStart) as PositionGridCell);
      pivotStart = Math.min(pivotStart, cell.columnStart);
      pivotEnd = Math.max(pivotEnd, cell.columnEnd);
    }
  }

  let next: DataRect;

  if (rect.columnStart < pivotStart) {
    let highestColEnd = -Infinity;
    let setCell: DataRect = rect;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(i, rect.columnStart + 1) as PositionGridCell);
      const boundary = cell.columnStart <= rect.columnStart ? cell.columnEnd : cell.columnStart;
      if (boundary > highestColEnd) {
        highestColEnd = boundary;
        setCell = cell;
      }
    }

    next = {
      ...rect,
      columnStart: highestColEnd,
      rowStart: Math.min(setCell!.rowStart, rect.rowStart),
      rowEnd: Math.max(setCell.rowEnd, rect.rowEnd),
    };

    scrollIntoView({ column: highestColEnd });
  } else {
    if (rect.columnEnd === view.visibleColumns.length) return null;

    let highestColEnd = -Infinity;
    let setCell: DataRect = rect;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(i, rect.columnEnd) as PositionGridCell);
      if (cell.columnEnd > highestColEnd) {
        highestColEnd = cell.columnEnd;
        setCell = cell;
      }
    }
    next = {
      ...rect,
      columnEnd: highestColEnd,
      rowStart: Math.min(setCell!.rowStart, rect.rowStart),
      rowEnd: Math.max(setCell.rowEnd, rect.rowEnd),
    };
    scrollIntoView({ column: highestColEnd - 1 });
  }

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;

  return nextSelections;
}
