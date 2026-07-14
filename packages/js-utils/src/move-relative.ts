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
 * Moves an element (and optionally additional elements) within an array to a new position,
 * keeping their relative order intact. The destination is expressed as the index of the
 * element the moved group should land next to.
 *
 * Returns the original array reference unchanged when `destIndex` is one of the
 * `additional` indices (no valid move). Returns a shallow copy in all other cases,
 * including out-of-bounds or equal src/dest indices.
 *
 * @param items - The source array (never mutated)
 * @param srcIndex - Index of the primary element to move
 * @param destIndex - Index of the target position anchor element
 * @param additional - Indices of extra elements to move together with `srcIndex` (default `[]`)
 * @returns A new array with the elements repositioned, or the original array if the move is a no-op
 *
 * @example
 * ```typescript
 * // Move element at index 1 to after index 3
 * moveRelative(['a','b','c','d','e'], 1, 3);
 * // ['a','c','d','b','e']
 *
 * // Move backward: element at index 3 to before index 1
 * moveRelative(['a','b','c','d','e'], 3, 1);
 * // ['a','d','b','c','e']
 *
 * // Move multiple elements together (srcIndex + additional)
 * moveRelative(['a','b','c','d','e'], 1, 3, [2]);
 * // ['a','d','b','c','e']
 *
 * // destIndex is in additional — returns original array unchanged
 * moveRelative(['a','b','c','d','e'], 1, 2, [2]) === items; // true
 * ```
 */
export function moveRelative<T>(
  items: T[],
  srcIndex: number,
  destIndex: number,
  additional: number[] = [],
): T[] {
  if (additional.includes(destIndex)) return items;

  const length = items.length;

  if (srcIndex < 0 || srcIndex >= length) return [...items];
  if (destIndex < 0 || destIndex >= length) return [...items];
  if (srcIndex === destIndex) return [...items];

  // Build the set of source indices to move. `additional` is deduped via Set
  // so a caller passing a repeated `srcIndex` (e.g. `[1, 3, 1]`) doesn't cause
  // the same element to be removed once but spliced in multiple times.
  const itemsToInsert = [srcIndex, ...additional];
  const moveSet = new Set(itemsToInsert);

  // Filter the source array by index, not by value, so duplicate values stay
  // distinct (see the `moveRelative` regression tests in
  // `move-relative.test.ts`).
  const result = items.filter((_, index) => !moveSet.has(index));

  // Compute `newTarget` from `destIndex` adjusted by the number of source
  // indices that were *removed before it*. Anchoring via `indexOf(dest)` would
  // resolve to the wrong occurrence when `dest`'s value appears multiple times
  // in the result.
  const removedBeforeDest = [...moveSet].filter((index) => index < destIndex).length;
  const newTarget = destIndex - removedBeforeDest + (srcIndex < destIndex ? 1 : 0);

  // Re-derive insertion indices against the original array so we don't depend
  // on a possibly-duplicate `additional` argument.
  const insertIndices = [...moveSet].sort((l, r) => l - r);

  result.splice(newTarget, 0, ...insertIndices.map((x) => items[x]));
  return result;
}
