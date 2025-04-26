import { rowIsGroup } from "@1771technologies/grid-core";
import type { BlockPaths, BlockStore } from "../types.js";
import type { FlattenRowContext } from "./types.js";
import type { RowNodeGroupCore } from "@1771technologies/grid-types/core";

export function flattenCenterRows<D>(
  { rowIdToRow, rowIndexToRow, rowIdToRowIndex, ranges }: FlattenRowContext<D>,
  blockSize: number,
  separator: string,
  lookup: BlockPaths<D>,
  topOffset: number,
  rowExpansions: Record<string, boolean | undefined>,
  rowExpansionsDefault: number | boolean,
) {
  const rowIsExpanded = (r: RowNodeGroupCore, depth: number) => {
    if (rowExpansions[r.id] != null) return rowExpansions[r.id];

    if (typeof rowExpansionsDefault === "number") return depth <= rowExpansionsDefault;

    return rowExpansionsDefault;
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

    return offset + blockStore.size;
  }

  const size = processBlocks("", lookup.get("") ?? { size: 0, map: new Map() }, topOffset, 0);

  return size + topOffset;
}
