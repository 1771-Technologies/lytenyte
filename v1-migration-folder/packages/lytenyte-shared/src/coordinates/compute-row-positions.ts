import type { RowHeight } from "../+types.non-gen.js";
import { makeUint32PositionArray } from "./make-uint32-position-array.js";

/**
 * Calculates vertical (y) coordinates for rows in a virtualized grid view.
 *
 * Each coordinate is computed cumulatively by adding the current row's height
 * to the previous row's position, creating a progressive offset pattern.
 */
export function computeRowPositions(
  rowCount: number,
  rowHeight: RowHeight,
  autoHeightGuess: number,
  autoHeightCache: Record<number, number>,
  getDetailHeight: (i: number) => number,
  containerHeight: number,
) {
  // Ensure row count is non-negative to prevent invalid coordinate calculations
  rowCount = Math.max(0, rowCount);

  // Handle fixed height rows (number value)
  // Simple case where each row has identical base height plus any detail height
  if (typeof rowHeight === "number") {
    return makeUint32PositionArray((i) => {
      return Math.max(rowHeight + getDetailHeight(i), 0);
    }, rowCount);
  }

  // Handle auto height rows
  // Uses cached measurements when available, falling back to estimated height
  // Note: Requires recalculation when autoHeightCache changes
  if (rowHeight === "auto") {
    return makeUint32PositionArray((i) => {
      const height = autoHeightCache[i] ?? autoHeightGuess;
      return Math.max(height + getDetailHeight(i), 0);
    }, rowCount);
  }

  // Handle dynamic height rows (function-based)
  // Calculates each row's height by calling the provided height function
  if (typeof rowHeight === "function") {
    return makeUint32PositionArray((i) => {
      const height = rowHeight(i);
      return Math.max(height + getDetailHeight(i), 0);
    }, rowCount);
  }

  // Handle fill height rows (format: "fill:X")
  // Distributes available space when rows don't fill container
  // Falls back to fixed height behavior when rows exceed container
  const height = Math.round(Number.parseFloat(rowHeight.split(":").at(1)!));
  const rowSpaceNeeded = height * rowCount;
  const freeSpace = containerHeight - rowSpaceNeeded;

  if (freeSpace <= 0)
    return makeUint32PositionArray((i) => Math.max(height + getDetailHeight(i), 0), rowCount);

  // Distribute remaining space among rows, reserving 1px to prevent scrollbar
  // This ensures rows are slightly shorter than container height
  const unitFreeSpace = Math.floor(freeSpace / rowCount);
  let spaceLeft = freeSpace - unitFreeSpace * rowCount - 1;

  return makeUint32PositionArray((i) => {
    const h = height + unitFreeSpace + (spaceLeft > 0 ? 1 : 0);
    spaceLeft--;
    return Math.max(h + getDetailHeight(i), 0);
  }, rowCount);
}
