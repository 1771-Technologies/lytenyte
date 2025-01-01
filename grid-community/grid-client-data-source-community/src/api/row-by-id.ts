import type { BlockGraph } from "@1771technologies/grid-graph";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { ClientState } from "../create-client-data-source";

export function rowById<D, E>(state: ClientState<D, E>, id: string) {
  const graph = state.graph.peek();
  const api = state.api.peek();

  const row = graph.rowById(id);
  if (!row || api.rowIsLeaf(row)) return row;

  // calculate aggregations
}
