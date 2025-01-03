import type { RowNodeGroup, Writable } from "@1771technologies/grid-types/community";
import type { ServerState } from "../create-server-data-source";
import type { AsyncDataRequestBlock } from "../types";
import { loadBlockData } from "./load-block-data";
import { getRowGroupPath } from "./get-row-group-path";

export function loadRowExpansion<D, E>(state: ServerState<D, E>, row: Writable<RowNodeGroup>) {
  const rowIndex = state.graph.rowIdToRowIndex(row.id);
  if (rowIndex == null) return;

  const path = getRowGroupPath(state, row);
  if (path.length === 0) return;

  const joinedPath = path.join(state.rowPathSeparator);
  const requestBlocks: AsyncDataRequestBlock[] = [
    {
      id: `${joinedPath}#0`,
      rowStart: rowIndex + 1,
      rowEnd: rowIndex + 1 + state.blockSize,
      blockStart: 0,
      blockEnd: state.blockSize,
      blockKey: 0,
      path,
    },
  ];

  // If we have already request this block, we can expand immediately

  if (state.graph.blockContains(joinedPath, 0)) {
    row.expanded = true;
    state.graph.blockFlatten();
    state.api.peek().rowRefresh();

    return;
  }

  row.loading = true;

  const controller = state.controller.peek();

  state.requestedBlocks.add(requestBlocks[0].id);
  loadBlockData(state, requestBlocks, {
    onFailure: () => {
      if (controller.signal.aborted) return;

      state.requestedBlocks.delete(requestBlocks[0].id);
      row.loading = false;
      row.error = true;

      state.api.peek().rowRefresh();
    },
    onSuccess: () => {
      if (controller.signal.aborted) return;

      row.loading = false;
      row.error = false;
      row.expanded = true;

      state.graph.blockFlatten();
      state.api.peek().rowRefresh();
    },
  });

  state.api.peek().rowRefresh();
}
