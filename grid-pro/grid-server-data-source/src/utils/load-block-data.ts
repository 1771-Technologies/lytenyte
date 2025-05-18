import type { ServerState } from "../create-server-data-source";
import type { AsyncDataRequestBlock } from "../types";
import { handleDataBlocks } from "./handle-data-blocks";
import { handleBottomBlock, handleTopBlock } from "./handle-pin-blocks";

export async function loadBlockData<D, E>(
  state: ServerState<D, E>,
  reqBlocks: AsyncDataRequestBlock[],
  resultCallbacks?: { onFailure?: () => void; onSuccess?: () => void },
) {
  try {
    const controller = state.controller.peek();

    const payload = await state.rowDataFetcher({
      api: state.api.peek(),
      reqTime: Date.now(),
      requestBlocks: reqBlocks,
      blockSize: state.blockSize,
    });

    // If we have aborted this request we can just skip this. Requests are aborted when the
    // view changes and we no longer care about the result of this response.
    if (controller.signal.aborted) return;

    handleTopBlock(payload, state);
    handleBottomBlock(payload, state);
    handleDataBlocks(payload, state);

    state.graph.blockFlatten();

    resultCallbacks?.onSuccess?.();
  } catch (e) {
    resultCallbacks?.onFailure?.();
    console.error(e);
  }
}
