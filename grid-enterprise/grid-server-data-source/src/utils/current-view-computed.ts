import { computed, type Signal } from "@1771technologies/react-cascada";
import type { AsyncDataRequestBlock } from "../types";
import type { BlockGraph } from "@1771technologies/grid-graph";
import { getAsyncDataRequestBlocks } from "./get-async-data-request-blocks";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export function currentViewComputed<D, E>(
  api$: Signal<ApiPro<D, E>>,
  graph: BlockGraph<D>,
  blockSize: number,
  separator: string,
) {
  return computed(() => {
    const api = api$.get();
    const sx = api.getState();

    let rowStart: number;
    let rowEnd: number;
    if (sx.paginate.get()) {
      const currentPage = sx.paginateCurrentPage.get();
      const pageSize = sx.paginatePageSize.get();

      rowStart = currentPage * pageSize;
      rowEnd = rowStart + pageSize;
    } else {
      const virtBounds = sx.internal.virtBounds.get();
      rowStart = virtBounds.rowStart;
      rowEnd = virtBounds.rowEnd;
    }

    if (rowStart === rowEnd) return [];

    const seenBlocks = new Set();
    const requests: AsyncDataRequestBlock[] = [];
    for (let i = rowStart; i < rowEnd; i++) {
      const asyncBlocks = getAsyncDataRequestBlocks(graph, i, blockSize, separator);

      asyncBlocks.forEach((c) => {
        if (seenBlocks.has(c.id)) return;
        requests.push(c);
        seenBlocks.add(c.id);
      });
    }

    return requests.sort((l, r) => l.rowStart - r.rowStart);
  });
}
