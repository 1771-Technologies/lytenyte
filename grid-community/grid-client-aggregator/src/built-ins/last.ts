/**
 * Returns the last non-null element in an array.
 * @param data - An array of any type
 * @returns The last element that is neither null nor undefined, or undefined if no such element exists
 * @example
 * last([1, 2, null]) // Returns 2
 * last([]) // Returns undefined
 * last([null, undefined]) // Returns undefined
 */
export function last(d: unknown[]) {
  return d.findLast((c) => c != null);
}
