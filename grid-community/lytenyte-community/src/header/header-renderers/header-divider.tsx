import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import type { ColumnPin } from "@1771technologies/grid-types/community";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { useMemo, type CSSProperties } from "react";
import { getTransform } from "../../renderer/get-transform";
import { t } from "@1771technologies/grid-design";

interface HeaderDividerProps {
  xPositions: Uint32Array;
  rowStart: number;
  rowEnd: number;
  pin: ColumnPin;
  column: ColumnCommunityReact<any>;
  api: ApiCommunityReact<any>;
  columnIndex: number;
  viewportWidth: number;
}

export function HeaderDivider({
  api,
  columnIndex,
  xPositions,
  viewportWidth,
  rowStart,
  pin,
  rowEnd,
  column,
}: HeaderDividerProps) {
  const isResizable = api.columnIsResizable(column);

  const style = useMemo(() => {
    const isStart = pin === "start";
    const isEnd = pin == "end";

    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + viewportWidth
      : xPositions[columnIndex] + sizeFromCoord(columnIndex, xPositions) - 1;

    const style = {
      transform: getTransform(x, 0),
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
    } as CSSProperties;

    if (isStart || isEnd) {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = 2;
    }

    return style;
  }, [columnIndex, pin, rowEnd, rowStart, viewportWidth, xPositions]);

  return (
    <div
      className={clsx(
        css`
          grid-column-start: 1;
          grid-column-end: 2;

          box-sizing: border-box;

          width: 1px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        `,
        isResizable &&
          css`
            cursor: col-resize;
          `,
      )}
      style={style}
    >
      <div
        className={css`
          height: calc(100% - 8px);
          width: 2px;
          background-color: ${t.colors.borders_pin_separator};
        `}
      />
    </div>
  );
}
