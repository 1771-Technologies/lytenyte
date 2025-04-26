import type { RowNodeGroupPro } from "@1771technologies/grid-types/pro";
import type { ServerState } from "../create-server-data-source";
import { loadRowExpansion } from "./load-row-expansion";

export function loadRowGroups(state: ServerState<any, any>) {
  const api = state.api.peek();
  const sx = api.getState();

  const expandedRowIds = Object.entries(sx.rowGroupExpansions.peek())
    .filter((c) => c[1])
    .map((c) => c[0]);

  const rowIndices = expandedRowIds
    .map((c) => state.graph.rowIdToRowIndex(c))
    .filter((c) => c != null) as number[];

  const rows = rowIndices
    .map((c) => state.graph.rowByIndex(c)!)
    .filter((c) => c && api.rowIsGroup(c));

  rows.forEach((c) => loadRowExpansion(state, c! as RowNodeGroupPro));
}
