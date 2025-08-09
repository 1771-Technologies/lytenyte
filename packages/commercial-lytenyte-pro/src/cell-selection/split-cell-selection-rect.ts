import type { DataRect } from "../+types.js";

interface SplitCellSelectionRectArgs {
  readonly rect: DataRect;
  readonly colStartCount: number;
  readonly colCenterCount: number;
  readonly rowTopCount: number;
  readonly rowCenterCount: number;
}

/**
 * Splits a cell selection rectangle into multiple rectangles when it crosses specified boundary regions.
 * This is useful for handling selections that span across different grid sections (e.g., fixed columns/rows,
 * scrollable areas).
 *
 * The splitting process happens in two phases:
 * 1. Column-wise splitting: Splits rectangles that cross column section boundaries
 * 2. Row-wise splitting: Further splits the resulting rectangles if they cross row section boundaries
 *
 * Splitting does not support full width rows. It is assumed that if full width rows are present then
 * the cell selection will just be drawn over them
 *
 * @example
 * // For a grid with 2 fixed start columns and 1 fixed top row:
 * const splits = splitCellSelectionRect({
 *   rect: { columnStart: 0, columnEnd: 3, rowStart: 0, rowEnd: 2 },
 *   colStartCount: 2,    // Number of fixed start columns
 *   colCenterCount: 10,  // Number of scrollable columns
 *   rowTopCount: 1,      // Number of fixed top rows
 *   rowCenterCount: 50   // Number of scrollable rows
 * });
 *
 * @param rect - The original cell selection rectangle to split
 * @param colStartCount - Number of columns in the start (usually fixed) section
 * @param colCenterCount - Number of columns in the center (usually scrollable) section
 * @param rowTopCount - Number of rows in the top (usually fixed) section
 * @param rowCenterCount - Number of rows in the center (usually scrollable) section
 * @returns An array of split rectangles. If no splits were necessary, returns an array with just the original rectangle
 */
export function splitCellSelectionRect({
  rect,
  colStartCount,
  colCenterCount,
  rowTopCount,
  rowCenterCount,
}: SplitCellSelectionRectArgs): DataRect[] {
  // Calculate the boundary positions for columns
  const colStartBound = colStartCount;
  const colEndBound = colStartCount + colCenterCount;

  const colSplits: DataRect[] = [];

  // Handle column splits first
  // Case 1: Selection starts before the fixed columns and extends into the scrollable area
  if (rect.columnStart < colStartBound && rect.columnEnd > colStartBound) {
    const startSplit: DataRect = {
      ...rect,
      columnEnd: colStartBound,
    };
    colSplits.push(startSplit);
    rect = { ...rect, columnStart: colStartBound };
  }

  // Case 2: Selection starts in the scrollable area and extends into the end section
  if (rect.columnStart < colEndBound && rect.columnEnd > colEndBound) {
    const endSplit: DataRect = {
      ...rect,
      columnStart: colEndBound,
    };
    rect = { ...rect, columnEnd: colEndBound };
    colSplits.push(endSplit);
  }

  // Add the remaining rectangle after column splits
  colSplits.push(rect);

  // Calculate the boundary positions for rows
  const topBound = rowTopCount;
  const bottomBound = rowTopCount + rowCenterCount;

  // Process row splits for each column-split rectangle
  const rowSplits: DataRect[] = [];
  for (let split of colSplits) {
    // Case 1: Selection spans from top section into center section
    if (split.rowStart < topBound && split.rowEnd > topBound) {
      const topSplit: DataRect = { ...split, rowEnd: topBound };
      split = { ...split, rowStart: topBound };
      rowSplits.push(topSplit);
    }

    // Case 2: Selection spans from center section into bottom section
    if (split.rowStart < bottomBound && split.rowEnd > bottomBound) {
      const bottomSplit: DataRect = { ...split, rowStart: bottomBound };
      split = { ...split, rowEnd: bottomBound };
      rowSplits.push(bottomSplit);
    }
    rowSplits.push(split);
  }

  return rowSplits.sort((l, r) => {
    return l.rowStart - r.rowStart || l.columnStart - r.columnStart;
  });
}
