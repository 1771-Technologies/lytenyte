import { ROW_TOTAL_KIND } from "@1771technologies/grid-constants";
import type { RowNode, RowNodeTotal } from "@1771technologies/grid-types/core";

/**
 * Type guard that checks if a row node is a total node.
 *
 * @param r - The row node to check
 * @typeParam T - The type of data associated with the row node
 *
 * @returns True if the row node is a total node, false otherwise
 *
 * @example
 * const node: RowNode<MyDataType> = getNode();
 * if (rowIsTotal(node)) {
 *   // TypeScript now knows node is RowNodeTotal
 *   console.log(node.totalData);
 * }
 */
export function rowIsTotal(r: RowNode<any>): r is RowNodeTotal {
  return r.kind === ROW_TOTAL_KIND;
}
