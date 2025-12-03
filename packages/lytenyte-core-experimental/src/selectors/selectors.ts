import type { SpanLayout } from "@1771technologies/lytenyte-shared";
import type { RowsContainerContextType } from "../rows/rows-container/context";

export const $colStartBound = (x: SpanLayout) => x.colCenterStart;
export const $colEndBound = (x: SpanLayout) => x.colCenterEnd;

export const $topHeight = (x: RowsContainerContextType) => x.topHeight;
export const $botHeight = (x: RowsContainerContextType) => x.bottomHeight;
export const $pinHeight = (x: RowsContainerContextType) => x.topHeight + x.bottomHeight;
export const $centerHeight = (x: RowsContainerContextType) => x.centerHeight;
export const $topCount = (x: RowsContainerContextType) => x.topCount;
export const $botCount = (x: RowsContainerContextType) => x.bottomCount;
export const $centerCount = (x: RowsContainerContextType) => x.centerCount;
