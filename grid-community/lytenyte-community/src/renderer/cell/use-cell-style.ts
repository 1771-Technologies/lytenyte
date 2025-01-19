import { useMemo, type CSSProperties } from "react";
import { getTransform } from "../get-transform";
import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { sizeFromCoord } from "@1771technologies/js-utils";
import type { RowPin } from "@1771technologies/grid-types/community";

export function useCellStyle(
  api: ApiCommunityReact<any>,
  xPositions: Uint32Array,
  yPositions: Uint32Array,
  columnIndex: number,
  rowIndex: number,
  columnSpan: number,
  rowSpan: number,
  column: ColumnCommunityReact<any>,
  rowPin: RowPin,
) {
  const sx = api.getState();
  const vpWidth = sx.internal.viewportInnerWidth.use();
  const vpHeight = sx.internal.viewportInnerHeight.use();
  const headerHeight = sx.internal.viewportHeaderHeight.use();
  const height = sizeFromCoord(rowIndex, yPositions, rowSpan);
  const width = sizeFromCoord(columnIndex, xPositions, columnSpan);

  const styleAndCss = useMemo(() => {
    const isStart = column.pin === "start";
    const isEnd = column.pin == "end";
    const isTop = rowPin === "top";
    const isBot = rowPin === "bottom";

    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + vpWidth
      : xPositions[columnIndex];
    const y = isBot
      ? yPositions[rowIndex] - yPositions.at(-1)! + (vpHeight - headerHeight)
      : isTop
        ? 0
        : yPositions[rowIndex];

    if (isBot) {
      console.log(headerHeight, y);
    }

    const transform = getTransform(x, y);
    const style = { height, width, transform } as CSSProperties;

    if (isStart || isEnd) {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = 2;
    }
    if (isTop || isBot) {
      style.position = "sticky";
      style.top = "0px";
      style.zIndex = column.pin === "start" ? 4 : 3;
    }

    return { style };
  }, [
    column.pin,
    columnIndex,
    headerHeight,
    height,
    rowIndex,
    rowPin,
    vpHeight,
    vpWidth,
    width,
    xPositions,
    yPositions,
  ]);

  return styleAndCss;
}
