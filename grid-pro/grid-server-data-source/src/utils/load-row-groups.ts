import type { RowNodeGroupPro } from "@1771technologies/grid-types/pro";
import type { ServerState } from "../create-server-data-source";
import { loadRowExpansion } from "./load-row-expansion";

export function loadRowGroups(state: ServerState<any, any>) {
  const api = state.api.peek();
  const sx = api.getState();

  const expansions = sx.rowGroupExpansions.peek();

  const expandedRowIds = Object.entries(expansions)
    .filter((c) => c[1])
    .map((c) => c[0]);

  const rowIndices = expandedRowIds
    .map((c) => state.graph.rowIdToRowIndex(c))
    .filter((c) => c != null) as number[];

  const rows = rowIndices
    .map((c) => state.graph.rowByIndex(c)!)
    .filter((c) => c && api.rowIsGroup(c));

  const loadedExpansions: Record<string, boolean> = {};

  rows.forEach((c) => loadRowExpansion(state, c! as RowNodeGroupPro, loadedExpansions));

  const finalExpansions = { ...expansions, ...loadedExpansions };

  state.graph.blockFlatten(finalExpansions);
}
