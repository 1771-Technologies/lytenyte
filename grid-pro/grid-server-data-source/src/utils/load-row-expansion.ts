import type { ServerState } from "../create-server-data-source";
import type { AsyncDataRequestBlock } from "../types";
import { loadBlockData } from "./load-block-data";
import { getRowGroupPath } from "./get-row-group-path";
import type { RowNodeGroupPro } from "@1771technologies/grid-types/pro";

type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export function loadRowExpansion<D, E>(
  state: ServerState<D, E>,
  row: Writable<RowNodeGroupPro>,
  loadedExpansions: Record<string, boolean>,
) {
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

  const sx = state.api.peek().getState();
  // If we have already request this block, we can expand immediately
  if (state.graph.blockContains(joinedPath, 0)) {
    state.graph.blockFlatten(sx.rowGroupExpansions.peek());
    state.api.peek().rowRefresh();

    return;
  }

  row.loading = true;
  loadedExpansions[row.id] = false;

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

      state.graph.blockFlatten(sx.rowGroupExpansions.peek());
      state.api.peek().rowRefresh();
    },
  });

  state.api.peek().rowRefresh();
}
