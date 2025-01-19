import type { ColumnCommunityReact } from "@1771technologies/grid-types";
import { useMemo, type CSSProperties } from "react";
import { getTransform } from "../renderer/get-transform";
import { sizeFromCoord } from "@1771technologies/js-utils";

interface HeaderCellProps {
  readonly column: ColumnCommunityReact<any>;
  readonly columnIndex: number;
  readonly viewportWidth: number;
  readonly rowStart: number;
  readonly rowEnd: number;

  readonly xPositions: Uint32Array;
  readonly startCount: number;
  readonly centerCount: number;
  readonly endCount: number;
}

export function HeaderCell({
  column,
  columnIndex,
  viewportWidth,
  rowStart,
  rowEnd,
  xPositions,
}: HeaderCellProps) {
  const style = useMemo(() => {
    const isStart = column.pin === "start";
    const isEnd = column.pin == "end";

    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + viewportWidth
      : xPositions[columnIndex];

    const width = sizeFromCoord(columnIndex, xPositions);
    const style = {
      transform: getTransform(x, 0),
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
      width,
    } as CSSProperties;

    if (isStart || isEnd) {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = 2;
    }

    return style;
  }, [column.pin, columnIndex, rowEnd, rowStart, viewportWidth, xPositions]);

  return (
    <div
      style={style}
      className={css`
        grid-column-start: 1;
        grid-column-end: 2;
      `}
    >
      {column.headerName ?? column.id}
    </div>
  );
}
