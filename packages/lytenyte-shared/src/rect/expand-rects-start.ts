import type { ColumnView } from "../columns/index.js";
import type { PositionGridCell, PositionUnion } from "../types.js";
import { isFullyWithinRect } from "./is-fully-within-rect.js";
import { rectFromGridCellPosition } from "./rect-from-grid-cell-position.js";
import { rectsOverlap } from "./rects-overlap.js";
import type { DataRect } from "./types.js";

export function expandRectsStart(
  scrollIntoView: (params: { row?: number; column?: number }) => void,
  cellRoot: (row: number, column: number) => PositionUnion | null,
  selections: DataRect[],
  meta: boolean,
  position: PositionGridCell,
  excludeMarker: boolean,
  view: ColumnView,
): DataRect[] | null {
  const pos = rectFromGridCellPosition(position);
  const rect = selections.at(-1);
  if (!rect || !rectsOverlap(rect, pos) || isFullyWithinRect(pos, rect)) return null;

  const first = excludeMarker ? 1 : 0;

  if (meta) {
    const next: DataRect = { ...rect, columnStart: first, columnEnd: pos.columnStart + 1 };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;

    if (pos.columnStart !== view.visibleColumns.length - 1) scrollIntoView({ column: first });
    return nextSelections;
  }

  const isAtEdge = pos.columnStart == rect.columnStart || pos.columnEnd === rect.columnEnd;

  let pivotStart = pos.columnStart;
  let pivotEnd = pos.columnEnd;
  // Our cell some how is spanned over. so for the current rowIndex, find the maximum span along the columns
  if (!isAtEdge) {
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(pos.columnStart, i) as PositionGridCell);
      pivotStart = Math.min(pivotStart, cell.columnStart);
      pivotEnd = Math.max(pivotEnd, cell.columnEnd);
    }
  }

  let next: DataRect;

  if (rect.columnEnd <= pivotEnd) {
    if (rect.columnStart === first) return null;

    let highestColEnd = -Infinity;
    let setCell: DataRect = rect;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(i, rect.columnStart - 1) as PositionGridCell);
      if (cell.columnStart > highestColEnd) {
        highestColEnd = cell.columnStart;
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
    let highestColEnd = -Infinity;
    let setCell: DataRect = rect;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(i, rect.columnEnd - 1) as PositionGridCell);
      if (cell.columnStart > highestColEnd) {
        highestColEnd = cell.columnStart;
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
