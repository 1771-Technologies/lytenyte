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

// Fork of https://github.com/epoberezkin/fast-deep-equal

/**
 * MIT License
 *
 * Copyright (c) 2017 Evgeny Poberezkin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Performs a deep equality comparison between two values of any type.
 * This is a performance-optimized implementation that handles a wide range of JavaScript
 * types including primitives, objects, arrays, Maps, Sets, RegExp, TypedArrays, and React elements.
 *
 * Special handling:
 * - Primitives: uses strict equality (`===`)
 * - NaN: two NaN values are considered equal
 * - Arrays: element-by-element deep equality
 * - Maps: deep equality of all key-value pairs
 * - Sets: membership equality (same elements present)
 * - TypedArrays: element-by-element strict equality
 * - RegExp: compared by `source` and `flags`
 * - Objects with custom `valueOf()` or `toString()`: compared by their return value
 * - React elements: `_owner` is skipped to avoid traversing circular references
 * - Objects with different constructors: considered not equal
 * - Own-property keys only: prototype-inherited properties are ignored
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns `true` if the two values are deeply equal, `false` otherwise
 *
 * @example
 * ```typescript
 * equal(1, 1)               // true
 * equal(NaN, NaN)           // true
 * equal([1, [2, 3]], [1, [2, 3]]) // true
 * equal({ a: 1 }, { a: 1 }) // true
 *
 * const m1 = new Map([['a', 1]]);
 * const m2 = new Map([['a', 1]]);
 * equal(m1, m2)             // true
 *
 * equal(/foo/i, /foo/i)     // true
 * equal(/foo/i, /foo/)      // false — flags differ
 * ```
 *
 * @remarks Fork of the fast-deep-equal library, extended for additional JS types and React.
 */
export function equal(a: any, b: any) {
  if (a === b) return true;

  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor) return false;

    let length, i;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!equal(a[i], b[i])) return false;
      return true;
    }

    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) if (!b.has(i[0])) return false;
      for (i of a.entries()) if (!equal(i[1], b.get(i[0]))) return false;
      return true;
    }

    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) if (!b.has(i[0])) return false;
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      // @ts-expect-error this is fine
      length = a.length;
      // @ts-expect-error this is fine
      if (length != b.length) return false;
      // @ts-expect-error this is fine
      for (i = length; i-- !== 0; ) if (a[i] !== b[i]) return false;
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    const keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; ) {
      const key = keys[i];

      if (key === "_owner" && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        continue;
      }

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
}
