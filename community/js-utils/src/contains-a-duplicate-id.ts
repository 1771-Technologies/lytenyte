/**
 * Checks if an array of objects contains any duplicate IDs.
 *
 * @template T - Type of objects in the array, must have a string 'id' property
 * @param items - Array of objects to check for duplicate IDs
 * @returns {boolean} True if any duplicate IDs are found, false otherwise
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: "1", name: "Alice" },
 *   { id: "2", name: "Bob" },
 *   { id: "1", name: "Charlie" }  // Duplicate ID
 * ];
 *
 * containsADuplicateId(users); // Returns: true
 * ```
 *
 * @example
 * ```typescript
 * const uniqueUsers = [
 *   { id: "1", name: "Alice" },
 *   { id: "2", name: "Bob" }
 * ];
 *
 * containsADuplicateId(uniqueUsers); // Returns: false
 * ```
 */
export function containsADuplicateId<T extends { id: string }>(items: T[]): boolean {
  const seen = new Set<string>();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (seen.has(item.id)) {
      return true;
    }

    seen.add(item.id);
  }
  return false;
}
