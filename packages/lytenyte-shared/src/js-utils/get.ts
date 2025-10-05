type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
    ? "0" extends keyof T
      ? undefined
      : number extends keyof T
        ? T[number]
        : undefined
    : undefined;

type FieldWithPossiblyUndefined<T, Key> =
  | GetFieldType<Exclude<T, undefined>, Key>
  | Extract<T, undefined>;

type IndexedFieldWithPossiblyUndefined<T, Key> =
  | GetIndexedField<Exclude<T, undefined>, Key>
  | Extract<T, undefined>;

export type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof T
    ? FieldWithPossiblyUndefined<T[Left], Right>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? FieldWithPossiblyUndefined<
            IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>,
            Right
          >
        : undefined
      : undefined
  : P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
        : undefined
      : undefined;

/**
 * Safely retrieves a deeply nested value from an object using a path string.
 * Supports both dot notation and array indexing.
 *
 * @template TData - The type of the source object
 * @template TPath - String literal type representing the access path
 * @param data - The source object to extract the value from
 * @param path - Path to the desired value using dot notation and/or array indexing
 * @returns The value at the specified path, or undefined if the path is invalid
 *
 * @example
 * Dot notation:
 * ```typescript
 * const user = {
 *   name: "Alice",
 *   address: {
 *     city: "New York"
 *   }
 * };
 * get(user, "address.city"); // Returns: "New York"
 * ```
 *
 * @example
 * Array indexing:
 * ```typescript
 * const data = {
 *   users: [
 *     { id: 1, name: "Alice" },
 *     { id: 2, name: "Bob" }
 *   ]
 * };
 * get(data, "users[0].name"); // Returns: "Alice"
 * ```
 *
 * @example
 * Mixed notation:
 * ```typescript
 * const data = {
 *   groups: [
 *     {
 *       members: [
 *         { name: "Alice" }
 *       ]
 *     }
 *   ]
 * };
 * get(data, "groups[0].members[0].name"); // Returns: "Alice"
 * ```
 *
 * @remarks
 * - Handles undefined values safely throughout the path
 * - Supports array access using numeric indices
 * - Preserves type information through TypeScript's type system
 * - Returns undefined for invalid paths
 */
export function get<TData, TPath extends string>(
  data: TData,
  path: TPath,
): GetFieldType<TData, TPath> {
  const valueItems = path.split(/[.[\]]/).filter(Boolean);

  let value = data;
  for (const key of valueItems) {
    value = (value as Record<string, TData>)?.[key];
  }

  return value as GetFieldType<TData, TPath>;
}
