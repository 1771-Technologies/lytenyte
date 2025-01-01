import type { ClientState } from "../create-client-data-source";
import { calculateRowAgg } from "./calculate-row-agg";

export function rowById<D, E>(state: ClientState<D, E>, id: string) {
  const graph = state.graph.peek();
  const api = state.api.peek();

  const row = graph.rowById(id);
  if (!row || api.rowIsLeaf(row)) return row;

  if (state.cache.peek()[id]) return row;

  return calculateRowAgg(state, row);
}
