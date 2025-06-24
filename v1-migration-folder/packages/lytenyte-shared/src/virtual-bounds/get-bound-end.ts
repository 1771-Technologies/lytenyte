import { rangedBinarySearch } from "./ranged-binary-search.js";

/**
 * Calculates the ending boundary index for virtualized content rendering.
 *
 * This function finds the last item that should be included in the viewport for
 * efficient virtualized rendering. It uses binary search to locate the last visible
 * position based on scroll offset and available space, then adds overscan items
 * to reduce flickering during scrolling.
 *
 * The function ensures we don't render beyond available data by clamping the result
 * to the maximum allowed count. The +1 adjustment makes the range inclusive since
 * binary search identifies the position just at the edge of visibility.
 */
export function getBoundEnd(
  positions: Uint32Array,
  offset: number,
  maxCount: number,
  space: number,
  overscan: number,
) {
  // Find last visible item with binary search, add overscan items plus 1 for inclusive range,
  // and ensure we don't exceed maximum allowed index
  return Math.min(maxCount, rangedBinarySearch(positions, offset + space) + overscan + 1);
}
