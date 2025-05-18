import type { BlockGraph } from "@1771technologies/grid-graph";
import type { AsyncDataRequestBlock } from "../types";
import { getAsyncDataRequestBlock } from "./get-async-data-request-block";

export function getAsyncDataRequestBlocks<D>(
  graph: BlockGraph<D>,
  rowIndex: number,
  blockSize: number,
  separator: string,
) {
  const ranges = graph.rowRangesForIndex(rowIndex);

  const blocks: AsyncDataRequestBlock[] = [];
  for (let i = ranges.length - 2; i >= 0; i--) {
    const parentFirstIndex = ranges[i + 1].rowStart - 1;
    const reqBlock = getAsyncDataRequestBlock(ranges[i], parentFirstIndex, blockSize, separator);

    blocks.push(reqBlock);
  }
  const lastRequestBlock = getAsyncDataRequestBlock(ranges.at(-1)!, rowIndex, blockSize, separator);
  blocks.push(lastRequestBlock);

  return blocks;
}
