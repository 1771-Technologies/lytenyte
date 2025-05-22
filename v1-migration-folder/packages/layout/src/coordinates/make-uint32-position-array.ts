/**
 * Creates a Uint32Array of cumulative positions/offsets based on element sizes.
 *
 * Generates a positions array where each element represents the cumulative sum of sizes
 * up to that index. The first element is always 0, and each subsequent element is the
 * running total of sizes for all previous elements.
 *
 * @example
 *
 * ```ts
 * const positions = makeUint32PositionArray(() => 4, 3); // [0, 4, 8, 12]
 *
 * const sizes = [2, 5, 3];
 * const positions = makeUint32PositionArray(i => sizes[i], 3); // [0, 2, 7, 10]
 * ```
 */
export function makeUint32PositionArray(getSize: (i: number) => number, count: number) {
  const positions = new Uint32Array(count + 1);

  for (let i = 0; i < count; i++) positions[i + 1] = positions[i] + Math.max(getSize(i), 0);

  return positions;
}
