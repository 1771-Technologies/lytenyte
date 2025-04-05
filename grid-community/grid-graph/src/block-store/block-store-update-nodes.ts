import type { RowNode } from "@1771technologies/grid-types/core";
import type { BlockPaths, BlockPayload } from "../types.js";

/**
 * Updates a block's nodes in the store using payload information.
 *
 * Associates a new array of nodes with a specific block index within an existing block store.
 * If the target block store doesn't exist, logs an error instead of creating it.
 *
 * @typeParam D - The type of data contained in the row nodes
 *
 * @param nodes - Array of row nodes to store
 * @param payload - Payload containing the target path and block index
 * @param lookup - Map-like storage containing the block stores
 * @returns void
 *
 * @remarks
 * The function:
 * 1. Checks if the block store exists at the payload path
 * 2. If not found:
 *    - Logs an error about missing initialization
 *    - Includes the attempted path in the error message
 *    - Returns without making changes
 * 3. If found:
 *    - Creates a new block entry with the provided nodes and index
 *    - Updates the block store's map with this entry
 *
 * @example
 * ```typescript
 * const nodes = [node1, node2, node3];
 * const payload = {
 *   path: 'root/block1',
 *   index: 2
 * };
 *
 * // Success case - block store exists
 * blockStoreUpdateNodes(nodes, payload, blockLookup);
 * // blockLookup.get('root/block1').map.get(2) === { data: [node1, node2, node3], index: 2 }
 *
 * // Error case - block store doesn't exist
 * blockStoreUpdateNodes(nodes, { path: 'missing', index: 0 }, blockLookup);
 * // Logs error about missing initialization
 * ```
 */
export function blockStoreUpdateNodes<D>(
  nodes: RowNode<D>[],
  payload: BlockPayload<D>,
  lookup: BlockPaths<D>,
) {
  const blockStoreToUpdate = lookup.get(payload.path);
  if (!blockStoreToUpdate) {
    console.error(
      "Can not update a block store before it has been initialized. Attempting to " +
        `update ${payload.path}. A size for the store must first be provided.`,
    );
    return;
  }

  blockStoreToUpdate.map.set(payload.index, { data: nodes, index: payload.index });
}
