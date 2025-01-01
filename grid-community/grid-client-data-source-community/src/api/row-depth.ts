import type { BlockGraph } from "@1771technologies/grid-graph";

export function rowDepth<D>(row: number, graph: BlockGraph<D>) {
  return graph.rowRangesForIndex(row).length - 1;
}
