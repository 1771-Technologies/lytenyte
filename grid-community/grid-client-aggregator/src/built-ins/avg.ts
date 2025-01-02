import { sum } from "./sum.js";

/**
 * Calculates the average (mean) of non-null values in an array.
 * @param data - An array of numbers that may include null values
 * @returns The average of all non-null numbers. Returns 0 for empty arrays.
 * @example
 * avg([1, 2, null, 3]) // Returns 2
 * avg([]) // Returns 0
 * avg([null, null]) // Returns 0
 */
export function avg(data: (number | null)[]) {
  if (!data.length) return 0;

  const total = sum(data);

  return total / data.length;
}
