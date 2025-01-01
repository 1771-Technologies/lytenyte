import type { BlockGraph } from "@1771technologies/grid-graph";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export function rowGroupToggle<D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  id: string,
  graph: BlockGraph<D>,
  state?: boolean,
) {
  const row = graph.rowById(id);
  if (!row || !api.rowIsGroup(row)) return;

  const next = state != null ? state : !row.expanded;
  if (next === row.expanded) return;

  (row as { expanded: boolean }).expanded = next;

  graph.blockFlatten();
  api.rowRefresh();
}
