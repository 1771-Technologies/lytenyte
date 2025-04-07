import type { RowNodeCore } from "@1771technologies/grid-types/core";
import type { ClientState } from "../create-client-data-source";
import { calculateRowAgg } from "./calculate-row-agg";

export function rowById<D, E>(state: ClientState<D, E>, id: string): RowNodeCore<D> | undefined {
  const graph = state.graph.peek();
  const api = state.api.peek();

  const row = graph.rowById(id);
  if (!row || api.rowIsLeaf(row)) return row;

  return calculateRowAgg(state, row);
}
