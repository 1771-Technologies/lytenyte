import type { RowNodeGroup } from "@1771technologies/grid-types/community";
import type { ServerState } from "../create-server-data-source";

export function getRowGroupPath<D, E>(state: ServerState<D, E>, row: RowNodeGroup) {
  const rowIndex = state.graph.rowIdToRowIndex(row.id);
  if (rowIndex == null) return [];

  const ranges = state.graph.rowRangesForIndex(rowIndex);
  const path = [...ranges.at(-1)!.path.split(state.rowPathSeparator), row.pathKey];

  return path;
}
