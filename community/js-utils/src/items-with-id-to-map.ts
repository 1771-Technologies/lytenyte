/**
 * Converts an array of objects with string IDs into a Map using the IDs as keys.
 *
 * @template T - Type of objects in the array, must have a string 'id' property
 * @param items - Array of objects to convert to a Map
 * @returns A Map where each key is an item's ID and the value is the item itself
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: "1", name: "Alice" },
 *   { id: "2", name: "Bob" }
 * ];
 *
 * const userMap = itemsWithIdToMap(users);
 * // Returns Map(2) {
 * //   "1" => { id: "1", name: "Alice" },
 * //   "2" => { id: "2", name: "Bob" }
 * // }
 * ```
 *
 * @remarks
 * - If multiple items share the same ID, later items will overwrite earlier ones
 * - The original array is not modified
 */
export function itemsWithIdToMap<T extends { id: string }>(items: T[]): Map<string, T>;
export function itemsWithIdToMap<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}
