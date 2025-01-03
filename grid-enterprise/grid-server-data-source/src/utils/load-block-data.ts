import type { ServerState } from "../create-server-data-source";
import type { AsyncDataRequestBlock } from "../types";
import { handleBottomBlock, handleTopBlock } from "./handle-pin-blocks";

export async function loadBlockData<D, E>(
  state: ServerState<D, E>,
  reqBlocks: AsyncDataRequestBlock[],
) {
  try {
    const controller = state.controller.peek();

    const payload = await state.rowDataFetcher({
      api: state.api.peek(),
      reqTime: Date.now(),
      requestBlocks: reqBlocks,
    });

    // If we have aborted this request we can just skip this. Requests are aborted when the
    // view changes and we no longer care about the result of this response.
    if (controller.signal.aborted) return;

    handleTopBlock(payload, state);
    handleBottomBlock(payload, state);
  } catch (e) {
    console.error(e);
  }
}
