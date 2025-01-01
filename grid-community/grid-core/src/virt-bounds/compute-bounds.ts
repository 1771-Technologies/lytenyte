import type { ScrollBounds } from "@1771technologies/grid-types/community";
import { getBoundEnd } from "./get-bound-end.js";
import { getBoundStart } from "./get-bound-start.js";

export interface ComputeBoundsArgs {
  viewportWidth: number;
  viewportHeight: number;
  scrollTop: number;
  scrollLeft: number;

  xPositions: Uint32Array;
  yPositions: Uint32Array;

  topCount: number;
  bottomCount: number;
  startCount: number;
  endCount: number;
}

export function computeBounds({
  viewportWidth,
  viewportHeight,
  scrollTop,
  scrollLeft,
  xPositions,
  yPositions,

  topCount,
  bottomCount,
  startCount,
  endCount,
}: ComputeBoundsArgs): ScrollBounds {
  const maxCenterRowCount = yPositions.length - 1 - bottomCount;

  const topOffset = scrollTop + yPositions[topCount];

  const rowStart = getBoundStart(yPositions, topOffset, 2, topCount, maxCenterRowCount);
  const rowEnd = getBoundEnd(yPositions, topOffset, maxCenterRowCount, viewportHeight, 1);

  const maxCenterColCount = xPositions.length - 1 - endCount;
  const leftOffset = scrollLeft + xPositions[startCount];

  const columnStart = getBoundStart(xPositions, leftOffset, 1, startCount, maxCenterColCount);
  const columnEnd = getBoundEnd(xPositions, leftOffset, maxCenterColCount, viewportWidth, 1);

  return { rowStart, rowEnd, columnStart, columnEnd };
}
