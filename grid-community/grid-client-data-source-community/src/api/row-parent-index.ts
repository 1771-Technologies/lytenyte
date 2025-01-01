import type { BlockGraph } from "@1771technologies/grid-graph";

export function rowParentIndex<D>(r: number, graph: BlockGraph<D>) {
  const range = graph.rowRangesForIndex(r).at(-1);

  if (!range) return null;
  const parentIndex = range.rowStart - 1;
  return parentIndex === -1 ? null : parentIndex;
}
