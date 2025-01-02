/**
 * Calculates the sum of all non-null numbers in an array.
 * @param data - An array of numbers that may include null values
 * @returns The sum of all non-null numbers in the array. Returns 0 for empty arrays or arrays containing only null values.
 * @example
 * sum([1, 2, null, 3]) // Returns 6
 * sum([]) // Returns 0
 * sum([null, null]) // Returns 0
 */
export function sum(data: (number | null)[]) {
  if (!data.length) return 0;

  let total = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    const d = data[i];
    if (d == null) continue;
    total += d;
  }

  return total;
}
