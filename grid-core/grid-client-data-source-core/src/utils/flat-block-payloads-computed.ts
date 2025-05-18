import { computed, type ReadonlySignal } from "@1771technologies/react-cascada";
import type { BlockPayload } from "@1771technologies/grid-graph";
import type { RowNodeLeafCore } from "@1771technologies/grid-types/core";

export const BLOCK_SIZE = 2000;

export function flatBlockPayloadsComputed<D>(nodes: ReadonlySignal<RowNodeLeafCore<D>[]>) {
  return computed(() => {
    const rowNodes = nodes.get();
    const blockCount = Math.ceil(rowNodes.length / BLOCK_SIZE);
    const payloads: BlockPayload<D>[] = [];

    for (let i = 0; i < blockCount; i++) {
      payloads.push({
        index: i,
        path: "",
        data: rowNodes.slice(i * BLOCK_SIZE, i * BLOCK_SIZE + BLOCK_SIZE),
      });
    }

    return { sizes: [{ path: "", size: rowNodes.length }], payloads };
  });
}
