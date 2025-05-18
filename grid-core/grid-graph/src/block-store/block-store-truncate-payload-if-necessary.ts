import type { BlockPayload } from "../types.js";

/**
 * Truncates a block's payload data if it exceeds the specified block size.
 *
 * Ensures that a block payload doesn't contain more nodes than the configured block size
 * by truncating excess nodes and logging an error when truncation occurs.
 *
 * @typeParam D - The type of data contained in the payload nodes
 *
 * @param payload - Block payload containing an array of data nodes and metadata
 * @param blockSize - Maximum number of nodes allowed in the block
 * @returns
 * - The original data array if its length is within blockSize
 * - A truncated array containing only the first blockSize nodes if the original exceeds blockSize
 *
 * @remarks
 * When truncation occurs, the function:
 * 1. Keeps only the first blockSize nodes
 * 2. Logs an error message containing:
 *    - The payload's path
 *    - The block index
 *    - A warning about truncation
 *
 * @example
 * ```typescript
 * const payload = {
 *   path: 'root/block1',
 *   index: 2,
 *   data: [node1, node2, node3, node4, node5]
 * };
 *
 * const truncated = blockStoreTruncatePayloadIfNecessary(payload, 3);
 * // Returns [node1, node2, node3]
 * // Logs error about truncation of nodes 4 and 5
 * ```
 */
export function blockStoreTruncatePayloadIfNecessary<D>(
  payload: BlockPayload<D>,
  blockSize: number,
) {
  const nodes = payload.data.length > blockSize ? payload.data.slice(0, blockSize) : payload.data;

  if (nodes.length !== payload.data.length) {
    console.error(
      `Payload with path "${payload.path}" and block index ${payload.index} contains more` +
        " data nodes than the configured blocksize. Additional nodes were truncated",
    );
  }

  return nodes;
}
