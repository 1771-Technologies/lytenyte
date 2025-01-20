import type { RowHeight } from "@1771technologies/grid-types/community";
import { makeUint32PositionArray } from "@1771technologies/js-utils";

/**
 * Calculates an array of row positions (cumulative heights) for a grid, taking into account
 * various height configurations and optional detail rows.
 *
 * @param rowCount - The total number of rows in the grid
 * @param rowHeight - The height configuration for rows. Can be:
 *                   - "auto" for dynamic heights based on content
 *                   - A fixed number for uniform height
 *                   - A function that returns height for each row index
 * @param autoHeightCache - A record mapping row indices to their calculated auto-heights
 * @param autoHeightGuess - The default height to use when a row's auto-height isn't in the cache
 * @param rowDetailEnabled - A function that determines if a row has an expanded detail section,
 *                          or null if detail rows are disabled
 * @param getDetailHeight - A function that returns the height of a row's detail section,
 *                         or null if detail rows are disabled
 *
 * @returns A Uint32Array containing cumulative positions (heights) for each row,
 *          where each index represents the starting position of that row
 *
 * @example
 * // Fixed height rows without details
 * const positions = rowGetPositions(100, 30, {}, 30, null, null);
 *
 * @example
 * // Auto-height rows with some cached heights
 * const positions = rowGetPositions(
 *   3,
 *   "auto",
 *   { 0: 50, 1: 40 },
 *   30,
 *   null,
 *   null
 * );
 *
 * @example
 * // Rows with detail sections
 * const positions = rowGetPositions(
 *   100,
 *   30,
 *   {},
 *   30,
 *   (i) => i % 2 === 0, // Even rows have details
 *   () => 100 // Detail sections are 100px tall
 * );
 */
export function rowGetPositions(
  rowCount: number,
  rowHeight: RowHeight,
  rowDetailEnabled: null | ((i: number) => boolean),
  getDetailHeight: null | ((i: number) => number),
) {
  const rowHeightCalculator = typeof rowHeight === "number" ? () => rowHeight : rowHeight;

  if (rowDetailEnabled) {
    const calculatorWithDetailHeight = (i: number) => {
      const height = rowHeightCalculator(i);
      if (rowDetailEnabled(i) && getDetailHeight) return getDetailHeight(i) + height;

      return height;
    };

    return makeUint32PositionArray(calculatorWithDetailHeight, rowCount);
  }

  return makeUint32PositionArray(rowHeightCalculator, rowCount);
}
