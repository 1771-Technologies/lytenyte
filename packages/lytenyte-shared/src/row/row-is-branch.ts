import type { RowGroup, RowNode } from "../types";

export function rowIsBranch(row: RowNode<any>): row is RowGroup {
  return row.kind === "branch";
}
