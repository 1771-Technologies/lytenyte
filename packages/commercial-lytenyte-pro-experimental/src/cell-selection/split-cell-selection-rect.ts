import type { DataRect } from "../types/api.js";

interface SplitCellSelectionRectArgs {
  readonly rect: DataRect;
  readonly colStartCount: number;
  readonly colCenterCount: number;
  readonly rowTopCount: number;
  readonly rowCenterCount: number;
  readonly isDeselect?: boolean;
}

export interface DataRectSplit extends DataRect {
  readonly isUnit: boolean;

  readonly borderTop?: boolean;
  readonly borderBottom?: boolean;
  readonly borderStart?: boolean;
  readonly borderEnd?: boolean;
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
}: SplitCellSelectionRectArgs): DataRectSplit[] {
  // Calculate the boundary positions for columns
  const colStartBound = colStartCount;
  const colEndBound = colStartCount + colCenterCount;

  const isUnit = rect.rowEnd - rect.rowStart === 1 && rect.columnEnd - rect.columnStart === 1;

  const colSplits: DataRectSplit[] = [];

  // Handle column splits first
  // Case 1: Selection starts before the fixed columns and extends into the scrollable area
  if (rect.columnStart < colStartBound && rect.columnEnd > colStartBound) {
    const startSplit: DataRectSplit = {
      ...rect,
      columnEnd: colStartBound,
      isUnit,
    };
    colSplits.push(startSplit);
    rect = { ...rect, columnStart: colStartBound };
  }

  // Case 2: Selection starts in the scrollable area and extends into the end section
  if (rect.columnStart < colEndBound && rect.columnEnd > colEndBound) {
    const endSplit: DataRectSplit = {
      ...rect,
      columnStart: colEndBound,
      isUnit,
    };
    rect = { ...rect, columnEnd: colEndBound };
    colSplits.push(endSplit);
  }

  // Add the remaining rectangle after column splits
  colSplits.push({ ...rect, isUnit });

  // Calculate the boundary positions for rows
  const topBound = rowTopCount;
  const bottomBound = rowTopCount + rowCenterCount;

  // Process row splits for each column-split rectangle
  const rowSplits: DataRectSplit[] = [];
  for (let split of colSplits) {
    // Case 1: Selection spans from top section into center section
    if (split.rowStart < topBound && split.rowEnd > topBound) {
      const topSplit: DataRectSplit = { ...split, rowEnd: topBound, isUnit };
      split = { ...split, rowStart: topBound };
      rowSplits.push(topSplit);
    }

    // Case 2: Selection spans from center section into bottom section
    if (split.rowStart < bottomBound && split.rowEnd > bottomBound) {
      const bottomSplit: DataRectSplit = {
        ...split,
        rowStart: bottomBound,
        isUnit,
      };
      split = { ...split, rowEnd: bottomBound };
      rowSplits.push(bottomSplit);
    }
    rowSplits.push(split);
  }

  return rowSplits
    .map((c) => ({ ...c, borderTop: true, borderBottom: true, borderEnd: true, borderStart: true }))
    .sort((l, r) => {
      return l.rowStart - r.rowStart || l.columnStart - r.columnStart;
    });
}
