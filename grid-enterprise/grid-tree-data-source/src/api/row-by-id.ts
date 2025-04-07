import { ROW_GROUP_KIND } from "@1771technologies/grid-constants";
import type { ClientState } from "../create-tree-data-source";
import type { RowNodePro } from "@1771technologies/grid-types/pro";

export function rowById<D, E>(state: ClientState<D, E>, id: string): RowNodePro<D> | undefined {
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
