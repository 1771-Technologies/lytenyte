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
 * Determines whether two numeric ranges overlap.
 * A range is defined by an inclusive start and an exclusive end `[start, end)`.
 * Two ranges are considered overlapping when they share at least one point.
 *
 * @param ls - Start of the left range (inclusive)
 * @param le - End of the left range (exclusive)
 * @param rs - Start of the right range (inclusive)
 * @param re - End of the right range (exclusive)
 * @returns `true` if the ranges share at least one point, `false` if they are disjoint
 *
 * @example
 * ```typescript
 * rangesOverlap(2, 6, 4, 8);  // true  — [2,6) and [4,8) share [4,6)
 * rangesOverlap(2, 4, 4, 8);  // false — adjacent, but [2,4) ends before [4,8) begins
 * rangesOverlap(0, 3, 5, 9);  // false — completely disjoint
 * rangesOverlap(3, 8, 3, 6);  // true  — same start
 * ```
 */
export function rangesOverlap(ls: number, le: number, rs: number, re: number) {
  // A range is considered overlapping if there is at least one point shared.
  // So we check if the ranges are NOT disjoint.
  return le > rs && re > ls;
}
