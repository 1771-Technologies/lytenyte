import "./header-divider.css";

import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { useMemo, type CSSProperties } from "react";
import { useResizeDivider } from "./use-resize-divider";
import { getTransform } from "../utils/get-transform";
import type { ApiCoreReact, ColumnCoreReact } from "@1771technologies/grid-types/core-react";

interface HeaderDividerProps {
  readonly api: ApiCoreReact<any>;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly column: ColumnCoreReact<any>;
  readonly columnIndex: number;
  readonly viewportWidth: number;

  readonly xPositions: Uint32Array;
  readonly startCount: number;
  readonly centerCount: number;
  readonly endCount: number;
}

export function HeaderDivider({
  api,
  columnIndex,
  xPositions,
  viewportWidth,
  rowStart,
  rowEnd,
  column,
  startCount,
  centerCount,
  endCount,
}: HeaderDividerProps) {
  const isResizable = api.columnIsResizable(column);

  const isLastStart = startCount > 0 && columnIndex === startCount - 1;
  const isFirstEnd = endCount > 0 && startCount + centerCount === columnIndex;
  const isLast = startCount + centerCount + endCount - 1 === columnIndex;

  const { onPointerDown, active: resizeActive } = useResizeDivider(api, column);

  const rtl = api.getState().rtl.use();
  const style = useMemo(() => {
    const isStart = column.pin === "start";
    const isEnd = column.pin == "end";

    const endAdjustment = centerCount + startCount - 1 === columnIndex && endCount > 0 ? 2 : 0;

    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + viewportWidth - 2
      : xPositions[columnIndex] + sizeFromCoord(columnIndex, xPositions) - 3 - endAdjustment;

    const xAdjustment = isLastStart ? 1 : isFirstEnd ? 0 : isLast ? 1 : 0;

    const style = {
      transform: getTransform((x - xAdjustment) * (rtl ? -1 : 1), 0),
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
    } as CSSProperties;

    if (isStart || isEnd) {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = 2;
    }
    if (isLast && !isResizable) style.opacity = 0;

    return style;
  }, [
    centerCount,
    column.pin,
    columnIndex,
    endCount,
    isFirstEnd,
    isLast,
    isLastStart,
    isResizable,
    rowEnd,
    rowStart,
    rtl,
    startCount,
    viewportWidth,
    xPositions,
  ]);

  return (
    <div
      onPointerDown={onPointerDown}
      data-resize-active={resizeActive}
      onDoubleClick={() => {
        const autosize = api.getState().autosizeDoubleClickHeader.peek();
        if (autosize) api.autosizeColumn(column, { includeHeader: true });
      }}
      className={clsx(
        "lng1771-header__cell-divider",
        isResizable && "lng1771-header__cell-divider--resizable",
      )}
      style={style}
    >
      <div />
    </div>
  );
}
