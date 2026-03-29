import type { RowNode } from "../types";

export function rowIsExpandable(row: RowNode<any>) {
  return row.kind === "branch" && row.expandable;
}
