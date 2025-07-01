/**
 * Finds the maximum value in an array of numbers that may include null or undefined values.
 * Iterates through the array from right to left.
 * @param data - An array of numbers that may include null or undefined values
 * @returns The maximum number found in the array. Returns 0 for empty arrays or if no valid numbers are found.
 * @example
 * max([1, null, 3, undefined, 2]) // Returns 3
 * max([]) // Returns 0
 * max([null, undefined]) // Returns 0
 */
export function max(data: (number | null | undefined)[]) {
  if (!data.length) return 0;

  let max = data[0];
  for (let i = data.length - 1; i > 0; i--) {
    const d = data[i];
    if (d != null && max == null) max = d;
    else if (d == null) continue;
    else if (d > max!) max = data[i];
  }

  return max ?? 0;
}
