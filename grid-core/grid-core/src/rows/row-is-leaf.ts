import { ROW_LEAF_KIND } from "@1771technologies/grid-constants";
import type { RowNodeCore, RowNodeLeafCore } from "@1771technologies/grid-types/core";

/**
 * Type guard that checks if a row node is a leaf node.
 *
 * @param r - The row node to check
 * @typeParam D - The type of data associated with the row node
 *
 * @returns True if the row node is a leaf node, false otherwise
 *
 * @example
 * const node: RowNode<MyDataType> = getNode();
 * if (rowIsLeaf(node)) {
 *   // TypeScript now knows node is RowNodeLeaf<MyDataType>
 *   console.log(node.data);
 * }
 */
export function rowIsLeaf<D>(r: RowNodeCore<D>): r is RowNodeLeafCore<D> {
  return r.kind === ROW_LEAF_KIND;
}
