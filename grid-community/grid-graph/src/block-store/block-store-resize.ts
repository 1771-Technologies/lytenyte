import type { BlockPaths } from "../types.js";
import { blockStoreUpdateSize } from "./block-store-update-size.js";
import type { RowNode } from "@1771technologies/grid-types/community";
import { blockStoreDeleteByNodes } from "./block-store-delete-by-nodes.js";

/**
 * Resizes a block and adjusts its child blocks to match the new size.
 *
 * Performs a resize operation on a block, which includes updating its size and
 * cleaning up any child blocks that are now outside the new size bounds.
 *
 * @param path - Path of the block to resize
 * @param size - New size for the block
 * @param blockSize - Size of each child block
 * @param lookup - Map-like storage containing the blocks
 * @param separator - String used to separate path segments
 *
 * @remarks
 * The resize process:
 * 1. Verifies the block exists at the specified path
 * 2. Updates the block's size using blockStoreUpdateSize
 * 3. Removes child blocks that fall outside the new size bounds
 * 4. Truncates the last block if it contains more rows than allowed by the new size
 *
 * Special handling for the last block:
 * - Calculates the maximum allowed rows based on the new size
 * - If the last block has more rows than allowed, truncates its data array
 * - This ensures partial blocks at the end are properly sized
 *
 * @example
 * ```typescript
 * const blockLookup = new Map([
 *   ['root', {
 *     size: 240,
 *     map: new Map([
 *       [0, { index: 0, data: [100 rows ] }],
 *       [1, { index: 1, data: [100 rows ] }],
 *       [2, { index: 2, data: [40 rows ] }]
 *     ])
 *   }]
 * ]);
 *
 * // Resize to 220 rows
 * blockStoreResize('root', 220, 100, blockLookup, '/');
 * // - Updates root block size to 220
 * // - Keeps blocks 0 and 1 intact
 * // - Truncates block 2 to 20 rows
 * ```
 */
export function blockStoreResize(
  path: string,
  size: number,
  blockSize: number,
  lookup: BlockPaths<any>,
  separator: string,
) {
  const rootBlock = lookup.get(path);
  if (!rootBlock) return;

  blockStoreUpdateSize(path, size, lookup);

  for (const block of rootBlock.map.values()) {
    if (block.index * blockSize < size) continue;

    blockStoreDeleteByNodes(path, block.data, lookup, separator);
  }

  // Special check for the last block. This ensures that excess rows in the last block are removed.
  // For example, if size is 220, but originally it was 240, then the last block may contain an
  // additional 20 rows that we need to clear.
  const lastBlockIndex = Math.floor(size / blockSize);
  const lastBlock = rootBlock.map.get(lastBlockIndex);
  const maxCount = size - lastBlockIndex * blockSize;

  if (lastBlock && lastBlock.data.length > maxCount) {
    (lastBlock as { data: RowNode[] }).data = lastBlock.data.slice(0, maxCount);
  }
}
