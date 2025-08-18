/**
 * Performs a modified binary search on a sorted array to find the rightmost index where the value
 * is less than or equal to the target.
 *
 * @param range - A sorted Uint32Array to search within
 * @param target - The number to search for
 * @returns The index of the rightmost element <= target, or the first index if no such element exists
 *
 * @example
 * const arr = new Uint32Array([1, 3, 3, 5, 7]);
 * rangedBinarySearch(arr, 3); // Returns 2
 * rangedBinarySearch(arr, 4); // Returns 2
 * rangedBinarySearch(arr, 0); // Returns 0
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
