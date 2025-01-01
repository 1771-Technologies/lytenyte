import { ROW_GROUP_KIND } from "@1771technologies/grid-constants";
import type { RowNode, RowNodeGroup } from "@1771technologies/grid-types/community";

/**
 * Type guard that checks if a row node is a group node.
 *
 * @param r - The row node to check
 * @typeParam T - The type of data associated with the row node
 *
 * @returns True if the row node is a group node, false otherwise
 *
 * @example
 * const node: RowNode<MyDataType> = getNode();
 * if (rowIsGroup(node)) {
 *   // TypeScript now knows node is RowNodeGroup
 *   console.log(node.groupRows.length);
 * }
 */
export function rowIsGroup(r: RowNode<any>): r is RowNodeGroup {
  return r.kind === ROW_GROUP_KIND;
}
