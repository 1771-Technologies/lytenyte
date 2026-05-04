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
 * Computes the Euclidean distance between two points in 2D space.
 *
 * @param x1 - The x-coordinate of the first point
 * @param y1 - The y-coordinate of the first point
 * @param x2 - The x-coordinate of the second point
 * @param y2 - The y-coordinate of the second point
 * @returns The straight-line distance between the two points
 *
 * @example
 * ```typescript
 * distance(0, 0, 3, 4);  // 5  (3-4-5 right triangle)
 * distance(0, 0, 0, 0);  // 0  (same point)
 * distance(1, 1, 4, 5);  // 5
 * ```
 */
export function distance(x1: number, y1: number, x2: number, y2: number) {
  const x = x1 - x2;
  const y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}
