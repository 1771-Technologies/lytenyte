import type { BlockGraph } from "@1771technologies/grid-graph";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export function rowByIndex<D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  r: number,
  graph: BlockGraph<D>,
  cache: Record<string, any>,
) {
  const row = graph.rowByIndex(r);
  if (!row || api.rowIsLeaf(row)) {
    (row as { rowIndex: number }).rowIndex = r;
    return row;
  }

  return row;
}
