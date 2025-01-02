import { ROW_GROUP_KIND } from "@1771technologies/grid-constants";
import type { ClientState } from "../create-tree-data-source";

export function rowById<D extends Record<string, unknown>, E>(
  state: ClientState<D, E>,
  id: string,
) {
  const graph = state.graph.peek();
  const api = state.api.peek();

  const row = graph.rowById(id);

  if (!row || api.rowIsLeaf(row)) {
    return row;
  }

  if (row.kind === ROW_GROUP_KIND) {
    (row.data as { data: any }).data = state.getRowDataForGroup(row);
  }

  return row;
}
