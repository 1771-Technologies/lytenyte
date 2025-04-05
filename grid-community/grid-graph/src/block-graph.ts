import {
  ROW_DEFAULT_PATH_SEPARATOR,
  ROW_GROUP_KIND,
  ROW_LEAF_KIND,
} from "@1771technologies/grid-constants";
import { blockStoreDelete } from "./block-store/block-store-delete.js";
import type { BlockPaths, BlockPayload } from "./types.js";
import { blockStoreCreate } from "./block-store/block-store-create.js";
import { blockStoreUpdateSize } from "./block-store/block-store-update-size.js";
import { blockStoreIsShrinking } from "./block-store/block-store-is-shrinking.js";
import { blockStoreResize } from "./block-store/block-store-resize.js";
import { blockStoreTruncatePayloadIfNecessary } from "./block-store/block-store-truncate-payload-if-necessary.js";
import { blockStoreUpdateNodes } from "./block-store/block-store-update-nodes.js";
import type { RowNode, RowNodeLeaf, RowNodeTotal, RowPin } from "@1771technologies/grid-types/core";
import { RangeTree, type FlattenedRange } from "./range-tree.js";
import { flattenTopRows } from "./block-flatten/flatten-top-rows.js";
import { flattenCenterRows } from "./block-flatten/flatten-center-rows.js";
import { flattenBottomRows } from "./block-flatten/flatten-bottom-rows.js";
import { EMPTY_TOTAL } from "./constants.js";
import { adjustRootRange } from "./block-flatten/adjust-root-range.js";
import { blockStoreAllPaths } from "./block-store/block-store-all-paths.js";

/**
 * Manages a hierarchical graph of row blocks with support for pinned rows, totals, and range-based operations.
 *
 * BlockGraph provides a sophisticated data structure for handling large sets of rows with features like:
 * - Top and bottom pinned rows
 * - Totals rows with configurable positioning
 * - Block-based row management
 * - Range-based row lookups
 * - Efficient row access by ID or index
 *
 * @typeParam D - Type of data contained in the row nodes
 *
 * @example
 * ```typescript
 * const graph = new BlockGraph<MyDataType>(100); // Create with block size of 100
 *
 * // Configure pinned rows
 * graph.setTop([topRow1, topRow2]);
 * graph.setBottom([bottomRow1]);
 *
 * // Set up totals
 * graph.setTotal(totalRow);
 * graph.setTotalPosition("bottom");
 * graph.setTotalPin(true);
 *
 * // Manage blocks
 * graph.blockSetSize("root", 1000);
 * graph.blockAdd([{ path: "root", index: 0, data: rows }]);
 *
 * // Flatten and access data
 * graph.blockFlatten();
 * const row = graph.rowByIndex(5);
 * ```
 */
export class BlockGraph<D> {
  /** Map of paths to block stores */
  readonly #blockPaths: BlockPaths<D>;
  /** Size of each block */
  readonly #blockSize: number;
  /** Separator used in block paths */
  readonly #blockPathSeparator: string;

  /** Array of pinned top rows */
  #rowTop: RowNodeLeaf<D>[] = [];
  /** Array of pinned bottom rows */
  #rowBottom: RowNodeLeaf<D>[] = [];

  /** Total row configuration */
  #rowTotal: RowNodeTotal = EMPTY_TOTAL;
  /** Position of total row (top, bottom, or null) */
  #rowTotalPosition: RowPin = null;
  /** Whether total row is pinned */
  #rowTotalIsPinned: boolean = false;

  /** Map of row IDs to row nodes */
  #rowById: Map<string, RowNode<D>> = new Map();
  /** Map of row indices to row nodes */
  #rowByIndex: Map<number, RowNode<D>> = new Map();
  /** Map of row ids to row indices  */
  #rowIdToRowIndex: Map<string, number> = new Map();
  /** Total count of rows */
  #rowCount: number = 0;
  /** Tree structure for range-based operations */
  #rangeTree: RangeTree = new RangeTree([]);

  /**
   * Creates a new BlockGraph instance.
   *
   * @param blockSize - Number of rows per block
   * @param blockPathSeparator - Optional custom separator for block paths
   */
  constructor(blockSize: number, blockPathSeparator?: string) {
    this.#blockSize = blockSize;
    this.#blockPaths = new Map();
    this.#blockPathSeparator = blockPathSeparator ?? ROW_DEFAULT_PATH_SEPARATOR;
  }

  /**
   * Sets the array of pinned top rows.
   * @param nodes - Array of leaf nodes to pin at the top
   */
  readonly setTop = (nodes: RowNodeLeaf<D>[]) => {
    this.#rowTop = nodes;
  };

  /**
   * Sets the array of pinned bottom rows.
   * @param nodes - Array of leaf nodes to pin at the bottom
   */
  readonly setBottom = (nodes: RowNodeLeaf<D>[]) => {
    this.#rowBottom = nodes;
  };

  /**
   * Sets the totals row.
   * @param node - Total row node
   */
  readonly setTotal = (node: RowNodeTotal) => {
    this.#rowTotal = node;
  };

  /**
   * Sets whether the totals row is pinned.
   * @param b - True to pin the totals row
   */
  readonly setTotalPin = (b: boolean) => {
    this.#rowTotalIsPinned = b;
  };

  /**
   * Sets the position of the totals row.
   * @param b - Position to place the totals row ("top", "bottom", or null)
   */
  readonly setTotalPosition = (b: RowPin) => {
    this.#rowTotalPosition = b;
  };

  /**
   * Retrieves a row by its ID.
   * @param id - ID of the row to retrieve
   * @returns The row node if found, undefined otherwise
   */
  readonly rowById = (id: string) => this.#rowById.get(id);

  /**
   * Retrieves a row by its index.
   * @param i - Index of the row to retrieve
   * @returns The row node if found, undefined otherwise
   */
  readonly rowByIndex = (i: number) => this.#rowByIndex.get(i);

  /**
   * Gets the total number of rows.
   * @returns Total row count
   */
  readonly rowCount = () => this.#rowCount;

  /**
   * Gets the number of pinned top rows.
   * @returns Count of pinned top rows
   */
  readonly rowTopCount = () => this.#rowTop.length;

  /**
   * Gets the number of pinned bottom rows.
   * @returns Count of pinned bottom rows
   */
  readonly rowBotCount = () => this.#rowBottom.length;

  /**
   * Gets the number of immediate children for a given row index
   *
   * @param r - The row index to check for children
   * @returns The number of direct children for the given row. Returns 0 if the row
   *          is not a group row or doesn't exist
   *
   * @remarks
   * This method only counts direct children, not descendants further down the hierarchy.
   * For example, if row A has child B, and B has child C, calling this method on row A
   * will return 1 (just B), not 2 (B and C).
   */
  readonly rowChildCount = (r: number) => {
    const path = this.rowGroupPath(r);
    if (path == null) return 0;

    const block = this.#blockPaths.get(path)!;

    return block.size;
  };

  /**
   * Retrieves all leaf node descendants of a given row index
   *
   * @param r - The row index to get leaf children for
   * @returns An array of leaf node descendants. Returns an empty array if the row
   *          is not a group row or doesn't exist
   *
   * @remarks
   * This method traverses the entire hierarchy below the given row, collecting only
   * the leaf nodes (rows that cannot have children). It's commonly used for
   * aggregation calculations where you need all the actual data rows within a group,
   * ignoring intermediate group rows.
   *
   * A leaf node is defined as a row where `kind === ROW_LEAF_KIND`.
   */
  readonly rowAllLeafChildren = (r: number) => {
    const path = this.rowGroupPath(r);
    if (path == null) return [];

    const allPaths = blockStoreAllPaths(path, this.#blockPaths, this.#blockPathSeparator);

    const leafNodes: RowNodeLeaf<D>[] = [];
    for (const path of allPaths) {
      const blocks = this.#blockPaths.get(path)!;

      for (const block of blocks.map.values()) {
        for (const row of block.data) {
          if (row.kind === ROW_LEAF_KIND) leafNodes.push(row);
        }
      }
    }

    return leafNodes;
  };

  /**
   * Retrieves all descendants of a given row index, including both group and leaf nodes
   *
   * @param r - The row index to get all children for
   * @returns An array of all descendant nodes (both groups and leaves), or undefined
   *          if the row is not a group row or doesn't exist
   *
   * @remarks
   * Unlike rowAllLeafChildren, this method returns all descendants regardless of their
   * kind. This includes both intermediate group rows and leaf rows. It's useful when
   * you need to process or modify the entire subtree under a group row.
   *
   * The returned array preserves the hierarchical structure through the order of elements,
   * with parent rows appearing before their children.
   */
  readonly rowAllChildren = (r: number) => {
    const path = this.rowGroupPath(r);

    if (path == null) return [];

    const allPaths = blockStoreAllPaths(path, this.#blockPaths, this.#blockPathSeparator);
    const nodes: RowNode<D>[] = [];
    for (const path of allPaths) {
      const blocks = this.#blockPaths.get(path)!;

      for (const block of blocks.map.values()) {
        nodes.push(...block.data);
      }
    }

    return nodes;
  };

  /**
   * Converts a row's string identifier to its current numeric index in the grid
   *
   * @param id - The unique string identifier of the row to look up
   * @returns The current numeric index of the row, or undefined if the row ID doesn't exist
   *
   * @remarks
   * This method provides a way to find a row's current position in the grid using its stable
   * identifier. The mapping between IDs and indices can change during operations like sorting,
   * filtering, or grouping, while the string IDs remain constant.
   *
   * The return value is undefined in these cases:
   * - The provided ID doesn't correspond to any row in the grid
   * - The row has been filtered out or is otherwise not currently visible
   */
  readonly rowIdToRowIndex = (id: string) => {
    return this.#rowIdToRowIndex.get(id);
  };

  /**
   * Retrieves all rows in the grid in their logical order
   *
   * @returns An array containing all row nodes in the grid, including:
   *          - Top pinned rows
   *          - Total row (if present)
   *          - Data rows from all blocks
   *          - Bottom pinned rows
   *
   * @remarks
   * This method returns a complete snapshot of all rows currently in the grid,
   * maintaining their structural organization. The returned array preserves the
   * following order:
   * 1. Top pinned rows first
   * 2. Total row (if configured)
   * 3. Main data rows from all block paths
   * 4. Bottom pinned rows last
   *
   * The returned array includes both group rows and leaf rows, and the rows
   * maintain their hierarchical relationships through their order in the array.
   *
   * Note that this operation can be expensive for large datasets as it creates
   * a new array containing references to all rows in the grid.
   *
   * @example
   * ```typescript
   * const allRows = grid.rowGetAllRows();
   * const rowCount = allRows.length;
   * const pinnedRows = allRows.filter(row => row.pinned);
   * ```
   */
  readonly rowGetAllRows = () => {
    const nodes: RowNode<D>[] = [];

    this.#rowTop.forEach((c) => nodes.push(c));
    if (this.#rowTotalPosition !== null) nodes.push(this.#rowTotal);
    this.#rowBottom.forEach((c) => nodes.push(c));

    for (const blocks of this.#blockPaths.values()) {
      for (const block of blocks.map.values()) {
        nodes.push(...block.data);
      }
    }

    return nodes;
  };

  /**
   * Constructs the full path identifier for a group row
   *
   * @param r - The row index to get the path for
   * @returns A string representing the full path to the group row, or null if the
   *          row is not a group row or doesn't exist
   *
   * @remarks
   * The path is constructed by combining:
   * 1. The paths of all parent ranges in reverse order
   * 2. The row's own pathKey
   *
   * These components are joined using the blockPathSeparator. The resulting path
   * uniquely identifies the location of the group row in the hierarchy and can be
   * used to access its associated blocks of data.
   *
   * Example path format:
   * `parentRange1/parentRange2/rowPathKey`
   */
  readonly rowGroupPath = (r: number) => {
    const row = this.rowByIndex(r);

    if (!row || row.kind !== ROW_GROUP_KIND) return null;

    const ranges = this.rowRangesForIndex(r);

    const lastPath = ranges.at(-1)!.path;
    return lastPath ? `${lastPath}${this.#blockPathSeparator}${row.pathKey}` : row.pathKey;
  };

  /**
   * Finds all ranges that contain the specified row index.
   *
   * @param i - Row index to look up
   * @returns Array of ranges containing the index. Empty array if index is out of bounds
   */
  readonly rowRangesForIndex = (i: number): FlattenedRange[] => {
    const topCount =
      this.rowTopCount() + (this.#rowTotalIsPinned && this.#rowTotalPosition === "top" ? 1 : 0);
    const botCount =
      this.rowBotCount() + (this.#rowTotalIsPinned && this.#rowTotalPosition === "bottom" ? 1 : 0);

    const count = this.rowCount();

    if (i >= count || i < 0) return [];
    if (i < topCount) return [{ rowStart: 0, rowEnd: topCount, path: "" }];
    if (i >= count - botCount) return [{ rowStart: count - botCount, rowEnd: count, path: "" }];

    return this.#rangeTree.findRangesForRowIndex(i);
  };

  /**
   * Sets or updates the size of a block at the specified path.
   *
   * @param path - Path to the block
   * @param size - New size for the block
   * @remarks
   * - Creates new block if path doesn't exist
   * - Deletes block if size <= 0
   * - Resizes existing block maintaining data consistency
   */
  readonly blockSetSize = (path: string, size: number) => {
    if (!this.#blockPaths.has(path)) {
      blockStoreCreate(path, size, this.#blockPaths);
      return;
    }

    if (size <= 0) {
      blockStoreDelete(path, this.#blockPaths, this.#blockPathSeparator);
      blockStoreUpdateSize(path, size, this.#blockPaths);
      return;
    }

    if (blockStoreIsShrinking(path, size, this.#blockPaths)) {
      blockStoreResize(path, size, this.#blockSize, this.#blockPaths, this.#blockPathSeparator);
      return;
    }

    blockStoreUpdateSize(path, size, this.#blockPaths);
  };

  /**
   * Adds multiple blocks of rows using the provided payloads.
   *
   * @param payloads - Array of block payloads containing path, index, and row data
   * @remarks Truncates payloads that exceed block size and updates the block store
   */
  readonly blockAdd = (payloads: BlockPayload<D>[]) => {
    for (let i = 0; i < payloads.length; i++) {
      const payload = payloads[i];

      const nodes = blockStoreTruncatePayloadIfNecessary(payload, this.#blockSize);
      blockStoreUpdateNodes(nodes, payload, this.#blockPaths);
    }
  };

  /**
   * Checks if the block has been loaded into the graph
   *
   * @param path the path of the block to check
   * @param n the block index to check
   */
  readonly blockContains = (path: string, n: number) => {
    return !!this.#blockPaths.get(path)?.map.has(n);
  };

  /**
   * Deletes a block and its descendants at the specified path.
   *
   * @param path - Path of the block to delete
   */
  readonly blockDeleteByPath = (path: string) => {
    blockStoreDelete(path, this.#blockPaths, this.#blockPathSeparator);
  };

  /**
   * Deletes a block by a given id. The id is the block's path plus a
   * #n identifier. For example, x-->a#2 deletes the block key of x-->a
   * of 2.
   *
   * @param id - Id for the block to delete
   */
  readonly blockDeleteById = (id: string) => {
    const parts = id.split("#");
    const n = Number.parseInt(parts.at(-1)!);
    const path = parts.slice(0, parts.length - 1).join("#");

    const blockMap = this.#blockPaths.get(path);
    if (!blockMap) return;

    blockMap.map.delete(n);
  };

  /**
   * Returns the root size of the graph. This is the size of the root block
   *
   * @returns size of the root block
   */
  readonly blockRootSize = () => {
    return this.#blockPaths.get("")?.size ?? 0;
  };

  /**
   * Resets the block graph by clearing all blocks.
   */
  readonly blockReset = () => {
    this.#blockPaths.clear();
  };

  /**
   * Flattens the block hierarchy into a linear structure.
   *
   * @remarks
   * Updates internal mappings and indices after flattening:
   * - Row ID to row mapping
   * - Row index to row mapping
   * - Total row count
   * - Range tree for lookups
   */
  readonly blockFlatten = (
    rowExpansions: Record<string, boolean | undefined> = {},
    rowDefaultExpansion: number | boolean = false,
  ) => {
    const rowIndexToRow = new Map<number, RowNode<D>>();
    const rowIdToRow = new Map<string, RowNode<D>>();
    const rowIdToRowIndex = new Map<string, number>();

    const ranges: FlattenedRange[] = [];
    const ctx = { rowIndexToRow, rowIdToRow, rowIdToRowIndex, ranges };

    const topOffset = flattenTopRows(
      ctx,
      this.#rowTop,
      this.#rowTotalPosition,
      this.#rowTotalIsPinned,
      this.#rowTotal,
    );

    const centerOffset = flattenCenterRows(
      ctx,
      this.#blockSize,
      this.#blockPathSeparator,
      this.#blockPaths,
      topOffset,
      rowExpansions,
      rowDefaultExpansion,
    );

    const rowCount = flattenBottomRows(
      ctx,
      this.#rowBottom,
      this.#rowTotalPosition,
      this.#rowTotalIsPinned,
      this.#rowTotal,
      centerOffset,
    );

    adjustRootRange(ranges, this.#rowTotalPosition, this.#rowTotalIsPinned);

    this.#rowByIndex = rowIndexToRow;
    this.#rowIdToRowIndex = rowIdToRowIndex;
    this.#rowById = rowIdToRow;
    this.#rowCount = rowCount;
    this.#rangeTree = new RangeTree(ranges);
  };
}
