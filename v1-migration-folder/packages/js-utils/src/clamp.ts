/**
 * Constrains a number within a minimum and maximum range (inclusive).
 *
 * @param min - The lower boundary of the range
 * @param number - The number to clamp
 * @param max - The upper boundary of the range
 * @returns The clamped value: if number is less than min, returns min;
 *          if number is greater than max, returns max; otherwise returns number
 *
 * @example
 * ```typescript
 * clamp(0, 5, 10);   // Returns: 5
 * clamp(0, -5, 10);  // Returns: 0
 * clamp(0, 15, 10);  // Returns: 10
 * ```
 */
export function clamp(min: number, number: number, max: number) {
  return Math.min(Math.max(number, min), max);
}
