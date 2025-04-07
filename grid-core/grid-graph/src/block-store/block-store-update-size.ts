import type { BlockPaths } from "../types.js";

/**
 * Updates the size of a block in the store, ensuring it's never negative.
 *
 * Finds a block at the specified path and updates its size to the new value,
 * but ensures the size is never less than zero.
 *
 * @param path - Path of the block to update
 * @param size - New size to set (will be clamped to minimum of 0)
 * @param lookup - Map-like storage containing the block
 * @returns void
 *
 * @remarks
 * The function:
 * 1. Attempts to find the block in the lookup
 * 2. If block doesn't exist, returns without changes
 * 3. If block exists, updates its size to max(0, size)
 *
 * @example
 * ```typescript
 * const blockLookup = new Map([
 *   ['root', { size: 10, map: new Map() }]
 * ]);
 *
 * blockStoreUpdateSize('root', 20, blockLookup);
 * // blockLookup.get('root').size === 20
 *
 * blockStoreUpdateSize('root', -5, blockLookup);
 * // blockLookup.get('root').size === 0
 *
 * blockStoreUpdateSize('missing', 15, blockLookup);
 * // No effect - block doesn't exist
 * ```
 */
export function blockStoreUpdateSize(path: string, size: number, lookup: BlockPaths<any>) {
  const c = lookup.get(path);
  if (!c) return;

  c.size = Math.max(0, size);
}
