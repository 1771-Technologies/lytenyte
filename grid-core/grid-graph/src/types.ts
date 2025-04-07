import type { RowNodeCore } from "@1771technologies/grid-types/core";

/**
 * Represents a block of row nodes with a specific index.
 *
 * @typeParam D - Type of data contained in the row nodes. Defaults to any.
 */
export type Block<D = any> = {
  /** Array of row nodes contained in this block. Readonly to prevent direct mutation. */
  readonly data: RowNodeCore<D>[];
  /** Index identifying this block's position in the block store */
  readonly index: number;
};

/**
 * Represents a store of blocks with a total size and map of block indices to blocks.
 *
 * @typeParam D - Type of data contained in the blocks. Defaults to any.
 */
export type BlockStore<D = any> = {
  /** Total size of all blocks in the store */
  size: number;
  /** Map of block indices to their corresponding blocks. Readonly to prevent direct mutation. */
  readonly map: Map<number, Block<D>>;
};

/**
 * Maps paths to their corresponding block stores.
 *
 * Provides a way to look up block stores by their string path identifiers.
 *
 * @typeParam D - Type of data contained in the block stores. Defaults to any.
 */
export type BlockPaths<D = any> = Map<string, BlockStore<D>>;

/**
 * Represents a payload for block operations containing data and metadata.
 *
 * Used when updating or manipulating blocks to provide all necessary information
 * in a single object.
 *
 * @typeParam D - Type of data contained in the row nodes. Defaults to any.
 *
 * @example
 * ```typescript
 * const payload: BlockPayload = {
 *   data: [rowNode1, rowNode2],
 *   index: 3,
 *   path: 'root/block1'
 * };
 * ```
 */
export interface BlockPayload<D = any> {
  /** Array of row nodes to be stored or processed. Readonly to prevent direct mutation. */
  readonly data: RowNodeCore<D>[];
  /** Index indicating where this payload should be stored in the block structure */
  readonly index: number;
  /** Path identifying the target location for this payload */
  readonly path: string;
}
