import type { RowNodeCore } from "@1771technologies/grid-types/core";
import type { FlattenedRange } from "../range-tree";

/**
 * Context object for row flattening operations that maintains bidirectional mappings between rows,
 * their string identifiers, and numeric indices.
 *
 * This interface provides the data structures necessary to efficiently look up row relationships
 * during the flattening process. It supports both string-based and index-based access patterns,
 * allowing for flexible traversal and manipulation of the row hierarchy.
 *
 * @typeParam D - The type of data contained in the row nodes
 *
 * @remarks
 * The context maintains four key mappings to support different access patterns:
 * - Row ID to Row Node: Enables direct lookups of row data using string identifiers
 * - Row Index to Row Node: Supports positional access to rows in the flattened structure
 * - Row ID to Row Index: Provides translation between string IDs and their current numeric positions
 * - Flattened Ranges: Tracks the current set of ranges being processed during flattening
 *
 * All properties are marked as readonly to ensure immutability during the flattening process,
 * preventing accidental state corruption. This immutability guarantee is essential for maintaining
 * data consistency throughout the operation.
 */
export interface FlattenRowContext<D> {
  /** Maps row string identifiers to their corresponding row nodes for direct data access */
  readonly rowIdToRow: Map<string, RowNodeCore<D>>;

  /** Maps numeric indices to row nodes, enabling positional access in the flattened structure */
  readonly rowIndexToRow: Map<number, RowNodeCore<D>>;

  /**
   * Provides bidirectional mapping between row IDs and their current numeric indices,
   * facilitating translation between string-based and position-based addressing
   */
  readonly rowIdToRowIndex: Map<string, number>;

  /**
   * Collection of ranges that have been flattened during processing,
   * representing the current state of the flattening operation
   */
  readonly ranges: FlattenedRange[];
}
