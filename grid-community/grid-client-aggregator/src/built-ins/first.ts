/**
 * Returns the first non-null element in an array.
 * @param data - An array of any type
 * @returns The first element that is neither null nor undefined, or undefined if no such element exists
 * @example
 * first([null, 1, 2]) // Returns 1
 * first([]) // Returns undefined
 * first([null, undefined]) // Returns undefined
 */
export function first(d: unknown[]) {
  return d.find((c) => c != null);
}
