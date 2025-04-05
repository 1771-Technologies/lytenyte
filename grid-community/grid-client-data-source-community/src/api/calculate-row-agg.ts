import type { RowNodeGroup, RowNodeTotal } from "@1771technologies/grid-types/core";
import type { ClientState } from "../create-client-data-source";
import { aggregator } from "@1771technologies/grid-client-aggregator";

export function calculateRowAgg<D, E>(state: ClientState<D, E>, row: RowNodeGroup | RowNodeTotal) {
  const api = state.api.peek();
  const cache = state.cache.peek();

  if (cache[row.id]) {
    (row as { data: unknown }).data = cache[row.id];

    return row;
  }

  if (api.rowIsTotal(row)) {
    const nodes = state.rowCenterNodes.peek();
    const aggResult = aggregator(api, nodes);

    (row as { data: unknown }).data = aggResult;
    cache[row.id] = aggResult;

    return row;
  }

  const graph = state.graph.peek();
  const index = graph.rowIdToRowIndex(row.id)!;

  const leafs = state.graph.peek().rowAllLeafChildren(index);

  const aggResult = aggregator(api, leafs);
  (row as { data: unknown }).data = aggResult;

  cache[row.id] = aggResult;

  return row;
}
