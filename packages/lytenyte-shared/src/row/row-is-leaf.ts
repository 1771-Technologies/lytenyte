import type { RowLeaf, RowNode } from "../types";

export function rowIsLeaf(row: RowNode<any>): row is RowLeaf {
  return row.kind === "leaf";
}
