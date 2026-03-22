import type { PositionGridCell, PositionUnion } from "../types.js";
import { rectFromGridCellPosition } from "./rect-from-grid-cell-position.js";
import type { DataRect } from "./types.js";

/**
 * Expands a `DataRect` until every span that is touched by the rect is fully
 * contained within it. The expansion is iterative: after each pass the four
 * boundaries are re-scanned with the updated rect until the rect stabilises.
 */
export function expandRectToFullSpans(
  rect: DataRect,
  cellRoot: (row: number, column: number) => PositionUnion | null,
): DataRect {
  let current = rect;

  while (true) {
    const next = { ...current };

    // Scan top boundary row
    for (let c = current.columnStart; c < current.columnEnd; c++) {
      const cell = rectFromGridCellPosition(cellRoot(current.rowStart, c) as PositionGridCell);
      if (cell.rowStart < next.rowStart) next.rowStart = cell.rowStart;
      if (cell.rowEnd > next.rowEnd) next.rowEnd = cell.rowEnd;
      if (cell.columnStart < next.columnStart) next.columnStart = cell.columnStart;
      if (cell.columnEnd > next.columnEnd) next.columnEnd = cell.columnEnd;
    }

    // Scan bottom boundary row
    for (let c = current.columnStart; c < current.columnEnd; c++) {
      const cell = rectFromGridCellPosition(cellRoot(current.rowEnd - 1, c) as PositionGridCell);
      if (cell.rowStart < next.rowStart) next.rowStart = cell.rowStart;
      if (cell.rowEnd > next.rowEnd) next.rowEnd = cell.rowEnd;
      if (cell.columnStart < next.columnStart) next.columnStart = cell.columnStart;
      if (cell.columnEnd > next.columnEnd) next.columnEnd = cell.columnEnd;
    }

    // Scan left boundary column
    for (let r = current.rowStart; r < current.rowEnd; r++) {
      const cell = rectFromGridCellPosition(cellRoot(r, current.columnStart) as PositionGridCell);
      if (cell.rowStart < next.rowStart) next.rowStart = cell.rowStart;
      if (cell.rowEnd > next.rowEnd) next.rowEnd = cell.rowEnd;
      if (cell.columnStart < next.columnStart) next.columnStart = cell.columnStart;
      if (cell.columnEnd > next.columnEnd) next.columnEnd = cell.columnEnd;
    }

    // Scan right boundary column
    for (let r = current.rowStart; r < current.rowEnd; r++) {
      const cell = rectFromGridCellPosition(cellRoot(r, current.columnEnd - 1) as PositionGridCell);
      if (cell.rowStart < next.rowStart) next.rowStart = cell.rowStart;
      if (cell.rowEnd > next.rowEnd) next.rowEnd = cell.rowEnd;
      if (cell.columnStart < next.columnStart) next.columnStart = cell.columnStart;
      if (cell.columnEnd > next.columnEnd) next.columnEnd = cell.columnEnd;
    }

    if (
      next.rowStart === current.rowStart &&
      next.rowEnd === current.rowEnd &&
      next.columnStart === current.columnStart &&
      next.columnEnd === current.columnEnd
    ) {
      return current;
    }

    current = next;
  }
}
