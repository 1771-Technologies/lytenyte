import type { RowHeight } from "../../types.js";
import { makePositionArray } from "../make-position-array/make-position-array.js";

/**
 * Calculates vertical (y) coordinates for rows in a virtualized grid view.
 *
 * Each coordinate is computed cumulatively by adding the current row's height
 * to the previous row's position, creating a progressive offset pattern.
 */
export function rowPositions(
  rowCount: number,
  rowHeight: RowHeight,
  autoHeightGuess: number,
  autoHeightCache: Record<number, number>,
  getDetailHeight: (i: number) => number,
  containerHeight: number,
) {
  const n = Math.max(0, rowCount);

  const makeFixed = (getH: (i: number) => number) =>
    makePositionArray((i) => Math.max(getH(i) + getDetailHeight(i), 0), n);

  if (typeof rowHeight === "number") return makeFixed(() => rowHeight);
  if (rowHeight === "auto") return makeFixed((i) => autoHeightCache[i] ?? autoHeightGuess);
  if (typeof rowHeight === "function") return makeFixed(rowHeight);

  // Handle fill height rows (format: "fill:X")
  // Distributes available space when rows don't fill the container.
  // Falls back to fixed height behavior when rows exceed or exactly fill it.
  const height = Math.round(Number.parseFloat(rowHeight.slice(5)));
  const freeSpace = containerHeight - height * n;

  if (freeSpace <= 0 || n === 0) return makeFixed(() => height);

  const unit = Math.floor(freeSpace / n);
  let remainder = freeSpace - unit * n - 1;

  return makeFixed(() => height + unit + (remainder > 0 ? (remainder--, 1) : 0));
}
