import type { FlattenedRange } from "@1771technologies/grid-graph";
import type { AsyncDataRequestBlock } from "../types";

export function getAsyncDataRequestBlock(
  range: FlattenedRange,
  rowIndex: number,
  blockSize: number,
  separator: string,
): AsyncDataRequestBlock {
  const relativeIndex = rowIndex - range.rowStart;
  const blockKey = Math.floor(relativeIndex / blockSize);
  const pageSize = range.rowEnd - range.rowStart;

  const blockStart = blockKey * blockSize;
  const blockEnd = Math.min(pageSize, blockStart + blockSize);

  const absoluteRowStart = range.rowStart + blockStart;
  const absoluteRowEnd = absoluteRowStart + (blockEnd - blockStart);

  const id = `${range.path}#${blockKey}`;

  return {
    id,
    blockStart,
    blockEnd,
    rowStart: absoluteRowStart,
    rowEnd: absoluteRowEnd,
    blockKey: blockKey,
    path: range.path ? range.path.split(separator) : [],
  };
}
