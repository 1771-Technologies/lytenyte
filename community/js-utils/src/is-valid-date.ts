/**
 * Checks if a Date object is valid and not NaN
 * @param d - The Date object to validate
 * @returns True if date is valid, false otherwise
 */
export function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d as unknown as number);
}
