interface ObjectEqualsOptions {
  /**
   * Enable circular reference handling using a cache.
   * @default false
   */
  circular?: boolean;

  /**
   * Enable cross-realm object comparison (e.g., vm contexts) by ignoring constructor strictness.
   * @default false
   */
  crossrealm?: boolean;

  /**
   * Enable React element comparison (checks $$typeof, type, key, ref, props).
   * @default false
   */
  react?: boolean;

  /**
   * Include symbol-keyed properties in object comparison.
   * @default false
   */
  symbols?: boolean;

  /**
   * Enable fallback comparison using valueOf() or toString() for unsupported types.
   * @default false
   */
  fallback?: boolean;

  /**
   * Internal cache for circular references (automatically managed if circular is true).
   * Supports both Map and WeakMap since only objects are cached.
   */
  cache?: Map<any, any> | WeakMap<object, any>;
}

/**
 * Core function to deeply compare two values for equality, supporting arrays, typed arrays, Sets, Maps, and more.
 * @param target The first value to compare.
 * @param source The second value to compare.
 * @param circular Enable circular reference handling.
 * @param crossrealm Enable cross-realm object comparison.
 * @param react Enable React element comparison.
 * @param symbols Include symbol-keyed properties.
 * @param fallback Enable fallback comparison for unsupported types.
 * @param cache Cache for circular references (Map or WeakMap).
 * @returns True if values are deeply equal, false otherwise.
 * @throws {TypeError} If an unsupported object type is encountered without fallback.
 */

export function objectEqualsCore(
  target: any,
  source: any,
  circular: boolean | undefined,
  crossrealm: boolean | undefined,
  react: boolean | undefined,
  symbols: boolean | undefined,
  fallback: boolean | undefined,
  cache: Map<any, any> | WeakMap<object, any> | undefined,
): boolean;

/**
 * Compares two values for deep equality.
 * @param target The first value to compare.
 * @param source The second value to compare.
 * @param options Optional configuration for comparison behavior.
 * @returns True if values are deeply equal, false otherwise.
 * @throws {TypeError} If an unsupported object type is encountered without fallback.
 */
export function objectEquals(target: any, source: any, options?: ObjectEqualsOptions): boolean;
