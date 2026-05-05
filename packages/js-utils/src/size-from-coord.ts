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
 * Calculates the size of a segment by finding the difference between two coordinates
 * at a specified distance apart in a coordinate array.
 *
 * @param i - The starting index in the coordinate array
 * @param coord - An array of unsigned 32-bit integers representing coordinates
 * @param distance - The distance between coordinates to measure (defaults to 1)
 * @returns The size of the segment (difference between the coordinates)
 */
export function sizeFromCoord(i: number, coord: Uint32Array, distance = 1) {
  return coord[i + distance] - coord[i];
}
