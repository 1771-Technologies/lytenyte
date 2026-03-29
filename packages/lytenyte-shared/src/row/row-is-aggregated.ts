import type { RowAggregated, RowNode } from "../types";

export function rowIsAggregated(row: RowNode<any>): row is RowAggregated {
  return row.kind === "aggregated";
}
