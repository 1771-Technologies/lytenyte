/*
Copyright 2026 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
