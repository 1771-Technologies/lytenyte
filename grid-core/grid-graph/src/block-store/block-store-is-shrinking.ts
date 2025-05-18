import type { BlockPaths } from "../types.js";

/**
 * Determines if a block at the specified path would shrink if resized to the given size.
 *
 * Checks if an existing block would decrease in size by comparing its current size
 * with a proposed new size.
 *
 * @param path - Path of the block to check
 * @param size - Proposed new size to compare against
 * @param lookup - Map-like storage containing the block
 * @returns
 * - true if the block exists and the new size is smaller than its current size
 * - false if the block doesn't exist or the new size is greater than or equal to current size
 *
 * @remarks
 * The function:
 * 1. Attempts to find the block in the lookup
 * 2. If block doesn't exist, returns false
 * 3. Compares the block's current size with the proposed size
 * 4. Returns true only if the new size would be smaller
 *
 * @example
 * ```typescript
 * const blockLookup = new Map([
 *   ['root', { size: 10, map: new Map() }]
 * ]);
 *
 * blockStoreIsShrinking('root', 5, blockLookup);  // true
 * blockStoreIsShrinking('root', 15, blockLookup); // false
 * blockStoreIsShrinking('missing', 5, blockLookup); // false
 * ```
 */
export function blockStoreIsShrinking(path: string, size: number, lookup: BlockPaths<any>) {
  const block = lookup.get(path);
  if (!block) return false;

  return block.size > size;
}
