/**
 * Finds the minimum value in an array of numbers that may include null or undefined values.
 * Iterates through the array from right to left.
 * @param data - An array of numbers that may include null or undefined values
 * @returns The minimum number found in the array. Returns 0 for empty arrays or if no valid numbers are found.
 * @example
 * min([1, null, 3, undefined, 2]) // Returns 1
 * min([]) // Returns 0
 * min([null, undefined]) // Returns 0
 */
export function min(data: (number | null | undefined)[]) {
  if (!data.length) return 0;

  let min = data[0];
  for (let i = data.length - 1; i > 0; i--) {
    const d = data[i];
    if (d != null && min == null) min = d;
    else if (d == null) continue;
    else if (d < min!) min = data[i];
  }

  return min ?? 0;
}
