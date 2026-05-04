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
 * Performs a shallow equality comparison between two arrays.
 * Two arrays are considered shallowly equal if they have the same length and every
 * element at each index is strictly equal (`===`).
 *
 * @param left - The first array to compare
 * @param right - The second array to compare
 * @returns `true` if both arrays have the same length and all elements are strictly equal, `false` otherwise
 *
 * @example
 * ```typescript
 * arrayShallow([1, 2, 3], [1, 2, 3]); // true
 * arrayShallow([1, 2], [1, 2, 3]);    // false — different lengths
 * arrayShallow([1, 2], [1, 3]);       // false — element at index 1 differs
 * arrayShallow([{a: 1}], [{a: 1}]);   // false — objects compared by reference
 * ```
 */
export function arrayShallow(left: any[], right: any[]): boolean {
  if (left.length !== right.length) return false;

  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) return false;
  }

  return true;
}
