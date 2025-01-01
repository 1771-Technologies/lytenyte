import type { ClientState } from "../create-client-data-source";
import { calculateRowAgg } from "./calculate-row-agg";

export function rowByIndex<D, E>(state: ClientState<D, E>, r: number) {
  const graph = state.graph.peek();
  const api = state.api.peek();

  const row = graph.rowByIndex(r);
  if (!row || api.rowIsLeaf(row)) {
    (row as { rowIndex: number }).rowIndex = r;
    return row;
  }

  const cache = state.cache.peek();

  if (cache[row.id]) return row;

  return calculateRowAgg(state, row);
}
