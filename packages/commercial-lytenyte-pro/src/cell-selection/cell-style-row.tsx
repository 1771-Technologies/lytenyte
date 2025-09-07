import { useMemo, type CSSProperties } from "react";
import { useGridRoot } from "../context.js";
import { getTranslate, sizeFromCoord } from "@1771technologies/lytenyte-shared";
import type { DataRectSplit } from "./split-cell-selection-rect";

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
  const cx = useGridRoot();

  const xPositions = cx.grid.state.xPositions.useValue();
  const yPositions = cx.grid.state.yPositions.useValue();
  const rtl = cx.grid.state.rtl.useValue();

  const meta = cx.grid.state.columnMeta.useValue();

  const startCount = meta.columnVisibleStartCount;
  const centerCount = meta.columnVisibleCenterCount;

  const ds = cx.grid.state.rowDataStore;
  const rowCount = ds.rowCount.useValue();
  const rowTopCount = ds.rowTopCount.useValue();
  const rowBotCount = ds.rowBottomCount.useValue();
  const vpWidth = cx.grid.state.viewportWidthInner.useValue();

  const style = useMemo(() => {
    const isStart = rect.columnStart < startCount;
    const isEnd = rect.columnStart >= startCount + centerCount;
    const isTop = isRowPinnedTop;
    const isBot = isRowPinnedBottom;

    const columnIndex = rect.columnStart;
    const rowIndex = rect.rowStart;

    const width = sizeFromCoord(rect.columnStart, xPositions, rect.columnEnd - rect.columnStart);
    const height = sizeFromCoord(rect.rowStart, yPositions, rect.rowEnd - rect.rowStart);

    const firstBotIndex = rowCount - rowBotCount;

    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + vpWidth
      : xPositions[columnIndex];

    let y: number | string;
    if (isBot) y = yPositions[rowIndex] - yPositions[firstBotIndex];
    else if (isTop) y = yPositions[rowIndex] - yPositions[rowTopCount];
    else {
      y = `calc(${yPositions[rowIndex] - yPositions[rowTopCount]}px - var(--ln-y-offset, 0px))`;
    }

    const transform = getTranslate(x * (rtl ? -1 : 1), y);

    const pinnedRow = isTop || isBot;
    const pinnedCell = isStart || isEnd;

    const style = {
      height,
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
    centerCount,
    isRowPinnedBottom,
    isRowPinnedTop,
    rect.columnEnd,
    rect.columnStart,
    rect.rowEnd,
    rect.rowStart,
    rowBotCount,
    rowCount,
    rowTopCount,
    rtl,
    startCount,
    vpWidth,
    xPositions,
    yPositions,
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
