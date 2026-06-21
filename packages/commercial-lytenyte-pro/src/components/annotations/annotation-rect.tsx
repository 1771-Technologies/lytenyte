import {
  bottomSection,
  endSection,
  startSection,
  topSection,
  type SectionedRect,
} from "@1771technologies/lytenyte-shared";
import { useMemo, type CSSProperties } from "react";
import { sizeFromCoord } from "@1771technologies/js-utils";
import {
  useXCoordinates,
  useYCoordinates,
  useRowCountsContext,
  useDimensionContext,
  useRtlContext,
  useSuppressScrollFlashContext,
  useAPI,
} from "@1771technologies/lytenyte-core/internal";
import type { Annotation } from "./types.js";

export function AnnotationRect({
  rect,
  annotation,
}: {
  readonly rect: SectionedRect;
  readonly annotation: Annotation<any>;
}) {
  const rtl = useRtlContext();

  const dimensions = useDimensionContext();

  const xPositions = useXCoordinates();
  const yPositions = useYCoordinates();

  const { rowCount, topCount: rowTopCount, bottomCount: rowBotCount } = useRowCountsContext();

  const isSync = useSuppressScrollFlashContext();

  const api = useAPI();

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

    let x: number | string;

    const factor = rtl ? -1 : 1;

    if (isSync) {
      x = isEnd
        ? (xPositions[columnIndex] - xPositions.at(-1)! + vpWidth) * factor
        : isStart
          ? xPositions[columnIndex] * factor
          : `calc(${xPositions[columnIndex] * factor}px - var(--ln-x-sync-offset,0))`;
    } else {
      x = isEnd ? xPositions[columnIndex] - xPositions.at(-1)! + vpWidth : xPositions[columnIndex];
    }

    let y: number | string;

    if (isSync) {
      if (isTop) y = yPositions[rowIndex];
      else y = yPositions[rowIndex] - yPositions[rowTopCount];
    } else {
      if (isBot) y = yPositions[rowIndex] - yPositions[firstBotIndex];
      else if (isTop) y = yPositions[rowIndex];
      else {
        y = `calc(${yPositions[rowIndex] - yPositions[rowTopCount]}px - var(--ln-y-offset, 0px))`;
      }
    }

    const transform = `translate3d(${typeof x == "string" ? x : `${x}px`}, ${typeof y === "string" ? y : `${y}px`}, 0px)`;

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
    rect.columnStart,
    rect.columnEnd,
    rect.section,
    rect.rowStart,
    rect.rowEnd,
    xPositions,
    yPositions,
    rowCount,
    rowBotCount,
    rtl,
    isSync,
    vpWidth,
    rowTopCount,
  ]);

  return (
    <div style={style} data-ln-annotation-rect data-ln-annotation-id={annotation.id}>
      {annotation.render({ api })}
    </div>
  );
}
