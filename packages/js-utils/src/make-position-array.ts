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
 * Creates a Uint32Array of cumulative positions/offsets based on element sizes.
 *
 * Generates a positions array where each element represents the cumulative sum of sizes
 * up to that index. The first element is always 0, and each subsequent element is the
 * running total of sizes for all previous elements.
 */
export function makePositionArray(getSize: (i: number) => number, count: number) {
  const positions = new Uint32Array(count + 1);

  for (let i = 0; i < count; i++) positions[i + 1] = positions[i] + Math.max(getSize(i), 0);

  return positions;
}
