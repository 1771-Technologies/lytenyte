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
 * This is a performance-optimized implementation that handles various JavaScript types
 * including objects, arrays, Maps, Sets, RegExp, TypedArrays, and React elements.
 *
 * Special handling is included for:
 * - NaN values (considered equal to each other)
 * - Functions (can be compared by their string representation)
 * - Maps and Sets (deep equality of entries)
 * - TypedArrays (byte-by-byte comparison)
 * - RegExp objects (source and flags comparison)
 * - Objects with custom valueOf() or toString() methods
 * - React elements (ignores _owner property to avoid circular references)
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @param compareFunctionsAsStrings - When true, functions are compared by their string
 *                                   representation rather than reference equality.
 *                                   Defaults to false.
 *
 * @returns boolean - True if the values are deeply equal, false otherwise.
 *
 * @example
 * ```typescript
 * // Simple values
 * equal(1, 1) // true
 * equal(NaN, NaN) // true
 * equal([1, 2], [1, 2]) // true
 * equal({a: 1}, {a: 1}) // true
 *
 * // Maps and Sets
 * const map1 = new Map([['a', 1]])
 * const map2 = new Map([['a', 1]])
 * equal(map1, map2) // true
 *
 * // Functions
 * const fn1 = () => {}
 * const fn2 = () => {}
 * equal(fn1, fn2) // false
 * equal(fn1, fn2, true) // true (comparing string representation)
 *
 * // React elements
 * const el1 = { type: 'div', props: {}, $$typeof: Symbol.for('react.element') }
 * const el2 = { type: 'div', props: {}, $$typeof: Symbol.for('react.element') }
 * equal(el1, el2) // true
 * ```
 *
 * @note This is a fork of the fast-deep-equal library optimized for additional
 * JavaScript types and special cases.
 */
export function equal(a: any, b: any, compareFunctionsAsStrings: boolean = false) {
  if (compareFunctionsAsStrings && typeof a === "function" && typeof b === "function") {
    return String(b) === String(a);
  }

  if (a === b) return true;

  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor) return false;

    let length, i;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!equal(a[i], b[i], compareFunctionsAsStrings)) return false;
      return true;
    }

    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) if (!b.has(i[0])) return false;
      for (i of a.entries()) if (!equal(i[1], b.get(i[0]), compareFunctionsAsStrings)) return false;
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

    for (i = length; i-- !== 0; )
      /* v8 ignore next 1 */
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0; ) {
      const key = keys[i];

      if (key === "_owner" && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        continue;
      }

      if (!equal(a[key], b[key], compareFunctionsAsStrings)) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
}
