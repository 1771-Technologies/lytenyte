import type { RowNodeCore } from "@1771technologies/grid-types/core";
import type { ClientState } from "../create-client-data-source";
import { calculateRowAgg } from "./calculate-row-agg";

export function rowByIndex<D, E>(state: ClientState<D, E>, r: number): RowNodeCore<D> | null {
  const graph = state.graph.peek();
  const api = state.api.peek();

  const row = graph.rowByIndex(r);

  if (!row) return null;

  (row as { rowIndex: number }).rowIndex = r;

  if (!row || api.rowIsLeaf(row)) {
    return row;
  }

  return calculateRowAgg(state, row);
}
