import type { BlockGraph } from "@1771technologies/grid-graph";
import type { ClientState } from "../create-client-data-source";

export function rowDepth<D, E>(state: ClientState<D, E>, row: number) {
  const graph = state.graph.peek();
  return graph.rowRangesForIndex(row).length - 1;
}
