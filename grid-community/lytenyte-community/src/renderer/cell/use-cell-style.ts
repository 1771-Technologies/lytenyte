import { useMemo, type CSSProperties } from "react";
import { getTransform } from "../get-transform";
import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import type { RowPin } from "@1771technologies/grid-types/community";
import { t } from "@1771technologies/grid-design";
import { cellSelected } from "./cell-classes";

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
  rowId: string,
) {
  const sx = api.getState();
  const vpWidth = sx.internal.viewportInnerWidth.use();
  const rowDetailHeight = sx.internal.rowDetailHeight.use();
  const height = sizeFromCoord(rowIndex, yPositions, rowSpan) - rowDetailHeight(rowIndex);
  const width = sizeFromCoord(columnIndex, xPositions, columnSpan);
  const selectedIds = sx.rowSelectionSelectedIds.use();

  const rtl = sx.rtl.use();

  const styleAndCss = useMemo(() => {
    const isStart = column.pin === "start";
    const isEnd = column.pin == "end";
    const isTop = rowPin === "top";
    const isBot = rowPin === "bottom";

    const isLastStart = sx.columnVisibleStartCount.peek() - 1 === columnIndex && columnIndex > 0;
    const isFirstEnd =
      sx.columnVisibleCenterCount.peek() + sx.columnVisibleStartCount.peek() === columnIndex;

    const rowCount = sx.internal.rowCount.peek();
    const rowTopCount = sx.internal.rowTopCount.peek();
    const rowBotCount = sx.internal.rowBottomCount.peek();

    const firstBotIndex = rowCount - rowBotCount;

    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + vpWidth
      : xPositions[columnIndex];
    const y = isBot
      ? yPositions[rowIndex] - yPositions[firstBotIndex]
      : isTop
        ? yPositions[rowIndex]
        : yPositions[rowIndex] - yPositions[rowTopCount];

    const transform = getTransform(x * (rtl ? -1 : 1), y);
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

    const selected = selectedIds.has(rowId);
    const className = clsx(
      selected && cellSelected,
      isLastStart &&
        css`
          position: relative;
          &::after {
            position: absolute;
            content: "";
            top: 0px;
            inset-inline-end: 0px;
            width: 1px;
            height: 100%;
            background-color: ${t.colors.borders_pin_separator};
          }
        `,
      isFirstEnd &&
        css`
          position: relative;
          &::after {
            position: absolute;
            content: "";
            top: 0px;
            inset-inline-start: 0px;
            width: 1px;
            height: 100%;
            background-color: ${t.colors.borders_pin_separator};
          }
        `,
    );

    return { style, className };
  }, [
    column.pin,
    columnIndex,
    height,
    rowId,
    rowIndex,
    rowPin,
    rtl,
    selectedIds,
    sx.columnVisibleCenterCount,
    sx.columnVisibleStartCount,
    sx.internal.rowBottomCount,
    sx.internal.rowCount,
    sx.internal.rowTopCount,
    vpWidth,
    width,
    xPositions,
    yPositions,
  ]);

  return styleAndCss;
}
