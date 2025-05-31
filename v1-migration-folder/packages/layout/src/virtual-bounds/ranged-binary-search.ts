/**
 * Finds the rightmost index in a sorted array where the value is less than or equal to the target.
 *
 * This specialized binary search is optimized for virtualized UI components. For example, when
 * determining which elements to render after scrolling to position 200px, this function efficiently
 * identifies the first element that should be included in the viewport.
 *
 * The function guarantees a valid index result:
 * - If an exact match is found, returns that index
 * - If the target falls between two values, returns the lower index
 * - If target is less than all values, returns 0
 * - If target is greater than all values, returns the last index
 */
export function rangedBinarySearch(range: Uint32Array, target: number): number {
  let start = 0;
  let end = range.length - 1;

  while (start <= end) {
    const mid = start + ((end - start) >> 1);

    if (range[mid] <= target && (mid === range.length - 1 || range[mid + 1] > target)) return mid;

    if (target < range[mid]) end = mid - 1;
    else start = mid + 1;
  }

  return start;
}
