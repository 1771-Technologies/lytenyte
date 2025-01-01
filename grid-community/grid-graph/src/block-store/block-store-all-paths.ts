import type { BlockPaths } from "../types.js";

/**
 * Retrieves all paths in a block store that match a given path prefix.
 *
 * Given a base path, this function collects all paths from the lookup that either match
 * exactly or are descendants of the base path (i.e., start with the base path plus separator).
 *
 * @typeParam D - The type of data stored in the block paths
 *
 * @param path - The base path to search for
 * @param lookup - Map-like object containing all block paths
 * @param separator - String used to separate path segments
 * @returns A Set containing the base path and all descendant paths found in the lookup
 *
 * @remarks
 * The function includes both:
 * - The exact path match (if it exists)
 * - All descendant paths that start with the base path plus separator
 *
 * @example
 * ```typescript
 * const lookup = new Map([
 *   ['root', data1],
 *   ['root/child1', data2],
 *   ['root/child2', data3],
 *   ['other', data4]
 * ]);
 *
 * const paths = blockStoreAllPaths('root', lookup, '/');
 * // paths contains: ['root', 'root/child1', 'root/child2']
 * ```
 */
export function blockStoreAllPaths<D>(
  path: string,
  lookup: BlockPaths<D>,
  separator: string,
): Set<string> {
  const paths = new Set([path]);

  const prefix = path + separator;

  for (const path of lookup.keys()) {
    if (path.startsWith(prefix)) paths.add(path);
  }

  return paths;
}
