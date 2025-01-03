import type { ServerState } from "../create-server-data-source";
import { loadBlockData } from "./load-block-data";

export function handleViewChange<D, E>(state: ServerState<D, E>, force?: boolean) {
  const currentView = state.currentView.peek();
  const previousView = state.previousView.peek();

  const currentViewIds = new Set(currentView.map((c) => c.id));
  const previousViewIds = new Set(previousView.map((c) => c.id));
  const newIds = currentViewIds.difference(previousViewIds);

  // We need to remove the ids that are now out of view.
  if (state.rowClearOutOfView) {
    const idsToRemove = previousViewIds.difference(currentViewIds);
    idsToRemove.forEach((id) => state.graph.blockDeleteById(id));
    state.graph.blockFlatten();
  }

  const requestedIds = state.requestedBlocks;
  const blocksToRequest = force
    ? currentView
    : currentView.filter((c) => newIds.has(c.id) && !requestedIds.has(c.id));

  const rowsBeingRequest = new Set<number>();

  blocksToRequest.forEach((b) => {
    for (let i = b.rowStart; i < b.rowEnd; i++) rowsBeingRequest.add(i);
  });

  // Add the rows to our requested rows
  state.requestedRows = state.requestedRows.union(rowsBeingRequest);

  loadBlockData(state, blocksToRequest, {
    onFailure: () => {
      blocksToRequest.forEach((b) => requestedIds.delete(b.id));

      state.api.peek().rowRefresh();
    },
    onSuccess: () => {
      // Remove the rows from our requested rows
      state.requestedRows = state.requestedRows.intersection(rowsBeingRequest);
      state.graph.blockFlatten();
      state.api.peek().rowRefresh();
    },
  });
}
