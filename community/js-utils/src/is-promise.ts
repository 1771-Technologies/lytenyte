/**
 * Type guard that checks if a value is a Promise or Promise-like object.
 *
 * @typeParam T - The type of the value contained within the Promise
 * @param value - The value to check
 * @returns A boolean indicating whether the value is a Promise, and a type predicate for TypeScript
 *
 * @example
 * ```typescript
 * const maybePromise: string | Promise<string> = "hello";
 * if (isPromise(maybePromise)) {
 *   // TypeScript knows maybePromise is Promise<string> here
 *   maybePromise.then(str => console.log(str));
 * }
 * ```
 */
export function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return Boolean(value && typeof value === "object" && "then" in value);
}
