/**
 * Creates a Uint32Array of cumulative positions/offsets based on element sizes.
 *
 * Generates a positions array where each element represents the cumulative sum of sizes
 * up to that index. The first element is always 0, and each subsequent element is the
 * running total of sizes for all previous elements.
 */
export function makePositionArray(getSize: (i: number) => number, count: number) {
  const positions = new Uint32Array(count + 1);

  for (let i = 0; i < count; i++) positions[i + 1] = positions[i] + Math.max(getSize(i), 0);

  return positions;
}
