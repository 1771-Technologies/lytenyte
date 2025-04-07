import type { BlockPaths } from "../types.js";

/**
 * Creates a new block in the block store with specified path and size.
 *
 * @param path - Unique path identifier for the new block
 * @param size - Size of the block. Must be greater than 0
 * @param lookup - Map-like storage for blocks where the new block will be added
 * @returns void if size is valid, otherwise returns early without creating a block
 *
 * @remarks
 * The function:
 * - Validates that the size is positive before creating the block
 * - Creates a new block entry with the specified size and an empty map for sub-blocks
 * - Stores the block in the lookup using the provided path as key
 *
 * The created block structure has two properties:
 * - size: The specified block size
 * - map: An empty Map for storing child blocks
 *
 * @example
 * ```typescript
 * const blockLookup = new Map();
 *
 * // Create a block with size 10
 * blockStoreCreate('root/block1', 10, blockLookup);
 *
 * // Results in:
 * // blockLookup.get('root/block1') === { size: 10, map: new Map() }
 * ```
 */
export function blockStoreCreate(path: string, size: number, lookup: BlockPaths<any>) {
  if (size <= 0) return;

  lookup.set(path, { size, map: new Map() });
}
