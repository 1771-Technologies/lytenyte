import type { RowNode } from "@1771technologies/grid-types/community";
import type { FlattenedRange } from "../range-tree";

/**
 * Context object for row flattening operations that maintains mappings between rows and their identifiers.
 *
 * This interface provides the necessary data structures to track relationships between row nodes
 * and their corresponding identifiers (both string IDs and numeric indices) during the flattening process.
 * It also maintains the current set of flattened ranges being processed.
 *
 * @typeParam D - The type of data contained in the row nodes
 *
 * @remarks
 * The context maintains three key mappings:
 * - Row ID to Row Node mapping for direct lookups by string identifier
 * - Row Index to Row Node mapping for positional lookups
 * - Current set of flattened ranges being processed
 *
 * All properties are readonly to prevent accidental modifications to the mappings
 * during the flattening process.
 */
export interface FlattenRowContext<D> {
  /** Maps row string identifiers to their corresponding row nodes */
  readonly rowIdToRow: Map<string, RowNode<D>>;

  /** Maps row numeric indices to their corresponding row nodes */
  readonly rowIndexToRow: Map<number, RowNode<D>>;

  /** Array of flattened ranges being processed */
  readonly ranges: FlattenedRange[];
}
