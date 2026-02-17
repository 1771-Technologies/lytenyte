import { useMemo, type CSSProperties } from "react";
import { getTranslate, sizeFromCoord } from "@1771technologies/lytenyte-shared";
import type { DataRectSplit } from "./split-cell-selection-rect.js";
import { useRoot } from "@1771technologies/lytenyte-core/internal";

export function CellStyleRow({
  rect,
  isRowPinnedTop,
  isDeselect,
  isRowPinnedBottom,
  isPivot,
}: {
  rect: DataRectSplit;
  isRowPinnedTop?: boolean;
  isDeselect?: boolean;
  isRowPinnedBottom?: boolean;
  isPivot?: boolean;
}) {
  const { xPositions, yPositions, rtl, view, source, dimensions } = useRoot();

  const startCount = view.startCount;
  const centerCount = view.centerCount;

  const rowCount = source.useRowCount();
  const rowTopCount = source.useTopCount();
  const rowBotCount = source.useBottomCount();

  const vpWidth = dimensions.innerWidth;

  const style = useMemo(() => {
    const columnStart = rect.columnStart;
    const columnEnd = rect.columnEnd;

    const isStart = columnStart < startCount;
    const isEnd = columnStart >= startCount + centerCount;
    const isTop = isRowPinnedTop;
    const isBot = isRowPinnedBottom;

    const columnIndex = columnStart;
    const rowIndex = rect.rowStart;

    const width = sizeFromCoord(columnStart, xPositions, columnEnd - columnStart);
    const height = sizeFromCoord(rect.rowStart, yPositions, rect.rowEnd - rect.rowStart);

    const firstBotIndex = rowCount - rowBotCount;

    const x = isEnd ? xPositions[columnIndex] - xPositions.at(-1)! + vpWidth : xPositions[columnIndex];

    let y: number | string;
    if (isBot) y = yPositions[rowIndex] - yPositions[firstBotIndex];
    else if (isTop) y = yPositions[rowIndex];
    else {
      y = `calc(${yPositions[rowIndex] - yPositions[rowTopCount]}px - var(--ln-y-offset, 0px))`;
    }

    const transform = getTranslate(x * (rtl ? -1 : 1), y);

    const pinnedRow = isTop || isBot;
    const pinnedCell = isStart || isEnd;

    const style = {
      height: height - 1, // Minus 1 because the bottom border is not included in cell heights.
      width,
      transform,
      position: "absolute",
      pointerEvents: "none",
      top: 0,
      zIndex: 1,

      gridRowStart: "1",
      gridRowEnd: "2",
      gridColumnStart: "1",
      gridColumnEnd: "2",
    } as CSSProperties;

    if (pinnedCell) {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = pinnedRow ? 6 : 3;
    }

    if (pinnedRow) {
      style.position = "sticky";
      style.top = "0px";
      style.zIndex = pinnedCell ? 6 : 3;
    }

    return style;
  }, [
    rect.columnStart,
    rect.columnEnd,
    rect.rowStart,
    rect.rowEnd,
    startCount,
    centerCount,
    isRowPinnedTop,
    isRowPinnedBottom,
    rowCount,
    rowBotCount,
    xPositions,
    vpWidth,
    yPositions,
    rowTopCount,
    rtl,
  ]);

  return (
    <div
      style={style}
      data-ln-cell-selection-rect
      data-ln-cell-selection-is-deselect={isDeselect}
      data-ln-cell-selection-is-pivot={isPivot}
      data-ln-cell-selection-is-unit={rect.isUnit}
      data-ln-cell-selection-border-top={rect.borderTop}
      data-ln-cell-selection-border-bottom={rect.borderBottom}
      data-ln-cell-selection-border-start={rect.borderStart}
      data-ln-cell-selection-border-end={rect.borderEnd}
    />
  );
}
