import type { PositionGridCell } from "../../types.js";
import type { DataRect } from "../types.js";

/**
 * Returns the bounding rect for a single cell, expanding to the full span
 * extent when the cell has a span root.
 */
function cellBounds(cell: PositionGridCell): DataRect {
  if (cell.root === null) {
    return {
      rowStart: cell.rowIndex,
      rowEnd: cell.rowIndex + 1,
      columnStart: cell.colIndex,
      columnEnd: cell.colIndex + 1,
    };
  }
  return {
    rowStart: cell.root.rowIndex,
    rowEnd: cell.root.rowIndex + cell.root.rowSpan,
    columnStart: cell.root.colIndex,
    columnEnd: cell.root.colIndex + cell.root.colSpan,
  };
}

/**
 * Returns the smallest `DataRect` that covers both cell positions `a` and `b`,
 * accounting for span extents on either cell.
 */
export function rectFromGridCellPositions(a: PositionGridCell, b: PositionGridCell): DataRect {
  const boundsA = cellBounds(a);
  const boundsB = cellBounds(b);
  return {
    rowStart: Math.min(boundsA.rowStart, boundsB.rowStart),
    rowEnd: Math.max(boundsA.rowEnd, boundsB.rowEnd),
    columnStart: Math.min(boundsA.columnStart, boundsB.columnStart),
    columnEnd: Math.max(boundsA.columnEnd, boundsB.columnEnd),
  };
}
