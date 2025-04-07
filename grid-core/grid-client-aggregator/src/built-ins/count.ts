/**
 * Counts the number of non-null elements in an array.
 * @param data - An array of any type
 * @returns The count of elements that are neither null nor undefined
 * @example
 * count([1, null, 'a', undefined]) // Returns 2
 * count([]) // Returns 0
 * count([null, undefined]) // Returns 0
 */
export function count(d: unknown[]) {
  let c = 0;
  for (let i = d.length - 1; i >= 0; i--) if (d[i] != null) c++;

  return c;
}
