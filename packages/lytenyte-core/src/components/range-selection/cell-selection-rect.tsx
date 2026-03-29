import {
  bottomSection,
  endSection,
  getTranslate,
  sizeFromCoord,
  startSection,
  topSection,
  type SectionedRect,
} from "@1771technologies/lytenyte-shared";
import { useMemo, type CSSProperties } from "react";
import { useRoot } from "../../root/root-context.js";
import { useXCoordinates, useYCoordinates } from "../../root/contexts/coordinates.js";
import { useRowCountsContext } from "../../root/contexts/grid-areas/row-counts-context.js";
import { useDimensionContext } from "../../root/contexts/viewport/dimensions-context.js";

export function CellSelectionRect({ rect, isDeselect }: { rect: SectionedRect; isDeselect?: boolean }) {
  const { rtl } = useRoot();
  const dimensions = useDimensionContext();

  const xPositions = useXCoordinates();
  const yPositions = useYCoordinates();

  const { rowCount, topCount: rowTopCount, bottomCount: rowBotCount } = useRowCountsContext();

  const vpWidth = dimensions.innerWidth;

  const style = useMemo(() => {
    const columnStart = rect.columnStart;
    const columnEnd = rect.columnEnd;

    const isStart = startSection[rect.section];
    const isEnd = endSection[rect.section];
    const isTop = topSection[rect.section];
    const isBot = bottomSection[rect.section];

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
    rect.section,
    rect.rowStart,
    rect.rowEnd,
    xPositions,
    yPositions,
    rowCount,
    rowBotCount,
    vpWidth,
    rtl,
    rowTopCount,
  ]);

  return (
    <div
      style={style}
      data-ln-cell-selection-rect
      data-ln-cell-selection-is-deselect={isDeselect}
      // TODO: These should be deprecated in v3
      data-ln-cell-selection-border-top
      data-ln-cell-selection-border-bottom
      data-ln-cell-selection-border-start
      data-ln-cell-selection-border-end
    />
  );
}
