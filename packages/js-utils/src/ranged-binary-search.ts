/*
Copyright 2026 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
