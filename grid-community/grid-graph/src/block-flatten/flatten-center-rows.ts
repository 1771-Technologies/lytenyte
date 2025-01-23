import { rowIsGroup } from "@1771technologies/grid-core";
import type { BlockPaths, BlockStore } from "../types.js";
import type { FlattenRowContext } from "./types.js";
import type { RowNodeGroup } from "@1771technologies/grid-types/community";

/**
 * Flattens the center rows of a grid, handling hierarchical data structures organized in blocks.
 * This function processes both regular rows and expandable group rows, maintaining their
 * hierarchical relationships while creating a flat index-based structure.
 *
 * The function handles:
 * 1. Block-based data organization for virtual scrolling
 * 2. Hierarchical group expansion/collapse
 * 3. Path-based navigation of the data hierarchy
 * 4. Range tracking for different hierarchical levels
 *
 * @param ctx - Context object for flattening operations
 * @param ctx.rowIdToRow - Map linking row IDs to row nodes
 * @param ctx.rowIndexToRow - Map linking row indices to row nodes
 * @param ctx.ranges - Array tracking row ranges for each hierarchical level
 *
 * @param blockSize - Number of rows in each block for virtual scrolling
 * @param separator - String used to separate path components in hierarchical paths
 * @param lookup - Map of paths to their corresponding block stores
 * @param topOffset - Starting index for center rows, accounting for pinned top rows
 *
 * @returns Total number of rows in the flattened center section
 *
 * @remarks
 * - The function maintains both index and ID-based lookups for efficient row access
 * - Handles nested group expansions recursively
 * - Tracks row ranges for each hierarchical level for easier navigation
 * - Respects block-based organization for optimal virtual scrolling
 */
export function flattenCenterRows<D>(
  { rowIdToRow, rowIndexToRow, rowIdToRowIndex, ranges }: FlattenRowContext<D>,
  blockSize: number,
  separator: string,
  lookup: BlockPaths<D>,
  topOffset: number,
  rowExpansions: () => Record<string, boolean>,
  rowExpansionsDefault: () => number | boolean,
) {
  const expansions = rowExpansions();
  const rowDefault = rowExpansionsDefault();
  const rowIsExpanded = (r: RowNodeGroup, depth: number) => {
    if (expansions[r.id] != null) return expansions[r.id];

    if (typeof rowDefault === "number") return depth <= rowDefault;

    return rowDefault;
  };

  // Recursive function to process blocks and their nested groups
  function processBlocks(path: string, blockStore: BlockStore<D>, start: number, depth: number) {
    // Sort blocks by their index to ensure correct order
    const blocks = [...blockStore.map.values()].sort((l, r) => l.index - r.index);

    // Track additional rows added by expanded groups
    let offset = 0;

    // Process each block in the current hierarchy level
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      // Process each row within the current block
      for (let j = 0; j < block.data.length; j++) {
        // Calculate the final index for this row, taking into account:
        // 1. Position within the block (j)
        // 2. Block's position (block.index * blockSize)
        // 3. Starting position of this hierarchy level (start)
        // 4. Additional rows from expanded groups above (offset)
        const rowIndex = j + block.index * blockSize + start + offset;
        const row = block.data[j];

        // Add row to both lookup maps
        rowIndexToRow.set(rowIndex, row);
        rowIdToRowIndex.set(row.id, rowIndex);
        rowIdToRow.set(row.id, row);

        // If this row is an expanded group, recursively process its children
        if (rowIsGroup(row) && rowIsExpanded(row, depth)) {
          // Build the path for this group's children
          const childPath = path ? path + separator + row.pathKey : row.pathKey;
          const childBlockStore = lookup.get(childPath);

          // Skip if no child blocks exist
          if (!childBlockStore) continue;

          // Recursively process child blocks and accumulate their size
          offset += processBlocks(childPath, childBlockStore, rowIndex + 1, depth + 1);
        }
      }
    }

    // Record the range of rows for this hierarchy level
    ranges.push({ rowStart: start, rowEnd: blockStore.size + start + offset, path });

    // Return total size including this level and all expanded child levels
    return offset + blockStore.size;
  }

  // Start processing from the root level ("") and return total size
  const size = processBlocks("", lookup.get("") ?? { size: 0, map: new Map() }, topOffset, 0);

  return size + topOffset;
}
