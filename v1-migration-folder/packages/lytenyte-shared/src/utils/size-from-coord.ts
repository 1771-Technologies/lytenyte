/**
 * Calculates the size of a segment by finding the difference between two coordinates
 * at a specified distance apart in a coordinate array.
 *
 * @param i - The starting index in the coordinate array
 * @param coord - An array of unsigned 32-bit integers representing coordinates
 * @param distance - The distance between coordinates to measure (defaults to 1)
 * @returns The size of the segment (difference between the coordinates)
 */
export function sizeFromCoord(i: number, coord: Uint32Array, distance = 1) {
  return coord[i + distance] - coord[i];
}
