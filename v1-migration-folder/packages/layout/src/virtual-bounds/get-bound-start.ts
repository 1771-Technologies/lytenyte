import { clamp } from "@1771technologies/lytenyte-js-utils";
import { rangedBinarySearch } from "./ranged-binary-search.js";

/**
 * Calculates the starting boundary index for virtualized content rendering.
 *
 * This function determines the first item that should be included in the viewport
 * during virtualized rendering. It uses binary search to find the earliest visible
 * position based on the current scroll offset, then subtracts an overscan amount
 * to pre-render additional items above the visible area.
 *
 * The result is constrained between minStart (typically representing pinned items that
 * must always be rendered) and maxStart (to prevent exceeding the bounds of available data).
 * This ensures we maintain the correct rendering boundaries regardless of scroll position.
 */
export function getBoundStart(
  positions: Uint32Array,
  offset: number,
  overscan: number,
  minStart: number,
  maxStart: number,
) {
  // Find first visible item with binary search, subtract overscan, then ensure
  // the result stays within allowed range using clamp
  return clamp(minStart, rangedBinarySearch(positions, offset) - overscan, maxStart);
}
