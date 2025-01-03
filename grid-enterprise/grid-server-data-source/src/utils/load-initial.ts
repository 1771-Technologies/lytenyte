import type { ServerState } from "../create-server-data-source";
import type { AsyncDataRequestBlock } from "../types";
import { loadBlockData } from "./load-block-data";

export function loadInitialData<D, E>(state: ServerState<D, E>) {
  const api = state.api.peek();
  const sx = api.getState();

  sx.overlayToShow.set("lng1771-loading-overlay");

  const reqBlocks: AsyncDataRequestBlock[] = [
    {
      path: [],
      blockKey: 0,
      blockStart: 0,
      blockEnd: state.blockSize,
      rowStart: 0,
      rowEnd: state.blockSize,
      id: "#0",
    },
  ];

  state.requestedBlocks.add("#0");

  loadBlockData(state, reqBlocks, {
    onFailure: () => sx.overlayToShow.set("lng1771-load-error-overlay"),
    onSuccess: () => {
      sx.overlayToShow.set(null);

      state.graph.blockFlatten();
      api.rowRefresh();
    },
  });
}
