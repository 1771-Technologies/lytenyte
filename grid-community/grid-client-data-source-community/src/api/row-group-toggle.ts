import type { BlockGraph } from "@1771technologies/grid-graph";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { ClientState } from "../create-client-data-source";

export function rowGroupToggle<D, E>(state: ClientState<D, E>, id: string, toggleState?: boolean) {
  const graph = state.graph.peek();
  const api = state.api.peek();

  const row = graph.rowById(id);
  if (!row || !api.rowIsGroup(row)) return;

  const next = toggleState != null ? toggleState : !row.expanded;
  if (next === row.expanded) return;

  (row as { expanded: boolean }).expanded = next;

  graph.blockFlatten();
  api.rowRefresh();
}
