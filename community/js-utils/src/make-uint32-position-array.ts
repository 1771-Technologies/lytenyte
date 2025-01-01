/**
 * Creates a Uint32Array of cumulative positions/offsets based on element sizes.
 *
 * Generates a positions array where each element represents the cumulative sum of sizes
 * up to that index. The first element is always 0, and each subsequent element is the
 * running total of sizes for all previous elements.
 *
 * @param getSize - Function that returns the size of the element at index i
 * @param count - Number of elements to generate positions for
 *
 * @returns A Uint32Array of length count + 1, where:
 *          - positions[0] is always 0
 *          - positions[i] is the sum of sizes for elements 0 through i-1
 *
 * @example
 * ```typescript
 * // For fixed-size elements of 4 bytes each
 * const positions = makeUint32PositionArray(() => 4, 3);
 * // positions = [0, 4, 8, 12]
 *
 * // For variable-size elements
 * const sizes = [2, 5, 3];
 * const positions = makeUint32PositionArray(i => sizes[i], 3);
 * // positions = [0, 2, 7, 10]
 * ```
 *
 * Common use cases:
 * - Creating offset tables for binary data structures
 * - Calculating positions in a buffer of variable-sized elements
 * - Memory layout calculations for packed data
 */
export function makeUint32PositionArray(getSize: (i: number) => number, count: number) {
  const positions = new Uint32Array(count + 1);

  for (let i = 0; i < count; i++) positions[i + 1] = positions[i] + getSize(i);

  return positions;
}
