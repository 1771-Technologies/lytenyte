import type { RowNode } from "../types";

export function rowIsExpanded(row: RowNode<any>) {
  return row.kind === "branch" && row.expanded;
}
