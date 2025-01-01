import type { BlockPaths } from "../types.js";
import { blockStoreAllPaths } from "./block-store-all-paths.js";

/**
 * Deletes a block and all its descendant blocks from the store.
 *
 * Uses blockStoreAllPaths to find all blocks that are either an exact match or
 * descendants of the specified path, then removes them from the lookup.
 *
 * @param path - Path of the block to delete along with its descendants
 * @param lookup - Map-like storage containing the blocks to delete
 * @param separator - String used to separate path segments in block paths
 *
 * @remarks
 * The deletion process:
 * 1. Retrieves all relevant paths using blockStoreAllPaths
 * 2. Deletes every matching block from the lookup
 *
 * This ensures complete cleanup by removing not just the specified block
 * but also any nested blocks that may exist below it in the hierarchy.
 *
 * @example
 * ```typescript
 * const blockLookup = new Map([
 *   ['root', block1],
 *   ['root/child1', block2],
 *   ['root/child2', block3],
 *   ['other', block4]
 * ]);
 *
 * blockStoreDelete('root', blockLookup, '/');
 * // Deletes 'root', 'root/child1', and 'root/child2'
 * // 'other' remains in the lookup
 * ```
 */
export function blockStoreDelete(path: string, lookup: BlockPaths<any>, separator: string) {
  const paths = blockStoreAllPaths(path, lookup, separator);

  for (const path of paths) lookup.delete(path);
}
