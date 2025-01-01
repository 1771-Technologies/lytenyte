import type { BlockGraph } from "@1771technologies/grid-graph";
import type { ClientState } from "../create-client-data-source";

export function rowParentIndex<D, E>(state: ClientState<D, E>, r: number) {
  const graph = state.graph.peek();
  const range = graph.rowRangesForIndex(r).at(-1);

  if (!range) return null;
  const parentIndex = range.rowStart - 1;
  return parentIndex === -1 ? null : parentIndex;
}
