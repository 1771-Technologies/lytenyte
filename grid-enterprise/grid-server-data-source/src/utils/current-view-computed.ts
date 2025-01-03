import { computed, type Signal } from "@1771technologies/cascada";
import type { AsyncDataRequestBlock } from "../types";
import { getAsyncDataRequestBlock } from "./get-async-data-request-block";
import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { BlockGraph } from "@1771technologies/grid-graph";

export function currentViewComputed<D, E>(
  api$: Signal<ApiEnterprise<D, E>>,
  graph: BlockGraph<D>,
  blockSize: number,
  separator: string,
) {
  return computed(() => {
    const api = api$.get();
    const sx = api.getState();
    const virtBounds = sx.internal.virtBounds.get();

    if (virtBounds.rowStart === virtBounds.rowEnd) return [];

    const seenBlocks = new Set();
    const requests: AsyncDataRequestBlock[] = [];
    for (let i = virtBounds.rowStart; i < virtBounds.rowEnd; i++) {
      const ranges = graph.rowRangesForIndex(i);

      for (let i = ranges.length - 2; i >= 0; i--) {
        const parentFirstIndex = ranges[i + 1].rowStart - 1;
        const reqBlock = getAsyncDataRequestBlock(
          ranges[i],
          parentFirstIndex,
          blockSize,
          separator,
        );
        if (seenBlocks.has(reqBlock.id)) continue;
        seenBlocks.add(reqBlock.id);

        requests.unshift(reqBlock);
      }
      const lastRequestBlock = getAsyncDataRequestBlock(ranges.at(-1)!, i, blockSize, separator);
      if (!seenBlocks.has(lastRequestBlock.id)) {
        requests.push(lastRequestBlock);
        seenBlocks.add(lastRequestBlock.id);
      }
    }

    return requests.sort((l, r) => l.rowStart - r.rowStart);
  });
}
