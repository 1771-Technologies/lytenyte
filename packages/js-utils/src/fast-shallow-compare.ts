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
 * Performs a shallow equality comparison between two objects using `Object.is` semantics
 * for individual property values.
 *
 * Two objects are considered shallowly equal when:
 * - They are the same reference, OR
 * - They have the same set of own enumerable keys, and every corresponding value
 *   satisfies `Object.is(a[key], b[key])`
 *
 * Unlike `===`, this correctly handles `NaN` (equal to itself) and distinguishes
 * `-0` from `+0`.
 *
 * @param a - First value to compare. May be `null`.
 * @param b - Second value to compare. May be `null`.
 * @returns `true` if both values are shallowly equal, `false` otherwise
 *
 * @example
 * ```typescript
 * fastShallowCompare({ x: 1, y: 2 }, { x: 1, y: 2 }); // true
 * fastShallowCompare({ x: 1 }, { x: 2 });              // false
 * fastShallowCompare({ x: 1 }, { x: 1, y: 2 });        // false — key count differs
 * fastShallowCompare(null, null);                       // true
 * fastShallowCompare(null, { x: 1 });                   // false
 *
 * // Object.is semantics
 * fastShallowCompare({ v: NaN }, { v: NaN }); // true  (NaN === NaN)
 * fastShallowCompare({ v: -0 }, { v: +0 });   // false (-0 !== +0)
 * ```
 */
export function fastShallowCompare<T extends Record<string, any> | null>(a: T, b: T) {
  if (a === b) return true;

  if (!(a instanceof Object) || !(b instanceof Object)) return false;

  let aLength = 0;
  let bLength = 0;

  for (const key in a) {
    aLength += 1;

    if (!Object.is(a[key], b[key])) {
      return false;
    }
    if (!(key in b)) {
      return false;
    }
  }

  for (const _ in b) bLength += 1;

  return aLength === bLength;
}
