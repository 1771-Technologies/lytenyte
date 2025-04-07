import type { RowNodeCore } from "@1771technologies/grid-types/core";
import type { BlockPaths } from "../types.js";
import { blockStoreDelete } from "./block-store-delete.js";
import { rowIsGroup } from "@1771technologies/grid-core";

/**
 * Deletes blocks from the store based on row nodes, but only if they are group nodes.
 *
 * Iterates through a collection of row nodes and deletes any corresponding blocks
 * in the store that represent groups. Non-group nodes are skipped.
 *
 * @param path - Base path used as prefix for block paths
 * @param nodes - Array of row nodes to process
 * @param lookup - Map-like storage containing the blocks to delete
 * @param separator - String used to separate path segments
 *
 * @remarks
 * For each node in the input array:
 * - Checks if the node is a group using rowIsGroup()
 * - If not a group, skips to next node
 * - If a group, constructs full path by combining:
 *   - Base path
 *   - Separator
 *   - Node's pathKey
 * - Calls blockStoreDelete with the constructed path
 *
 * @example
 * ```typescript
 * const nodes = [
 *   { pathKey: 'group1', type: 'group' },
 *   { pathKey: 'row1', type: 'row' },    // Will be skipped
 *   { pathKey: 'group2', type: 'group' }
 * ];
 *
 * blockStoreDeleteByNodes('root', nodes, blockLookup, '/');
 * // Deletes blocks at paths: 'root/group1' and 'root/group2'
 * ```
 */
export function blockStoreDeleteByNodes(
  path: string,
  nodes: RowNodeCore<any>[],
  lookup: BlockPaths<any>,
  separator: string,
) {
  for (const node of nodes) {
    if (!rowIsGroup(node)) continue;

    const pathToDelete = path + separator + node.pathKey;
    blockStoreDelete(pathToDelete, lookup, separator);
  }
}
