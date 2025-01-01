import type { BlockGraph } from "@1771technologies/grid-graph";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export function rowById<D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  id: string,
  graph: BlockGraph<D>,
  cache: Record<string, any>,
) {
  const row = graph.rowById(id);
  if (!row || api.rowIsLeaf(row)) return row;

  // calculate aggregations
}
