import { equal } from "@1771technologies/js-utils";
import type { ServerState } from "../create-server-data-source";
import { loadBlockData } from "./load-block-data";
import type { AsyncDataRequestBlock } from "../types";

export function handleViewChange<D, E>(state: ServerState<D, E>, force?: boolean) {
  const currentView = state.currentView.peek() as AsyncDataRequestBlock[];
  const previousView = state.previousView.peek() as AsyncDataRequestBlock[];

  if (equal(currentView, previousView)) return;

  state.previousView.set(currentView);

  const currentViewIds = new Set(currentView.map((c) => c.id));
  const previousViewIds = new Set(previousView.map((c) => c.id));
  const newIds = currentViewIds.difference(previousViewIds);

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

  if (!blocksToRequest.length) return;

  if (blocksToRequest.every((c) => state.requestedBlocks.has(c.id))) return;

  blocksToRequest.forEach((c) => state.requestedBlocks.add(c.id));

  loadBlockData(state, blocksToRequest, {
    onFailure: () => {
      blocksToRequest.forEach((b) => requestedIds.delete(b.id));
      rowsBeingRequest.forEach((row) => state.requestedFails.add(row));

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
