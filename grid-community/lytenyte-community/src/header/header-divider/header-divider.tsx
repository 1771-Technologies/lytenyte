import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { useMemo, type CSSProperties } from "react";
import { getTransform } from "../../renderer/get-transform";
import { t } from "@1771technologies/grid-design";
import { useResizeDivider } from "./use-resize-divider";
import { HEADER_CELL_DIVIDER } from "@1771technologies/grid-constants";

interface HeaderDividerProps {
  readonly api: ApiCommunityReact<any>;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly column: ColumnCommunityReact<any>;
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

  const resizeProps = useResizeDivider(api, column);

  const isLast = startCount + centerCount + endCount - 1 === columnIndex;
  const rtl = api.getState().rtl.use();
  const style = useMemo(() => {
    const isStart = column.pin === "start";
    const isEnd = column.pin == "end";

    const endAdjustment = centerCount + startCount - 1 === columnIndex && endCount > 0 ? 2 : 0;

    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + viewportWidth - 2
      : xPositions[columnIndex] + sizeFromCoord(columnIndex, xPositions) - 3 - endAdjustment;

    const style = {
      transform: getTransform((x - (isLast ? 2 : 0)) * (rtl ? -1 : 1), 0),
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
    isLast,
    isResizable,
    rowEnd,
    rowStart,
    rtl,
    startCount,
    viewportWidth,
    xPositions,
  ]);

  const autosizeOnDouble = api.getState().autosizeDoubleClickHeader.use();

  return (
    <div
      {...resizeProps}
      onDoubleClick={
        autosizeOnDouble
          ? () => {
              api.autosizeColumn(column, { includeHeader: true });
            }
          : undefined
      }
      className={clsx(
        HEADER_CELL_DIVIDER,
        css`
          grid-column-start: 1;
          grid-column-end: 2;

          box-sizing: border-box;

          width: 4px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        `,
        isResizable &&
          css`
            cursor: col-resize;

            &:hover div {
              background-color: ${t.headerDividerResizeY};
            }
          `,
      )}
      style={style}
    >
      <div
        className={css`
          height: calc(100% - 8px);
          width: 1px;
          background-color: ${t.headerDividerY};
        `}
      />
    </div>
  );
}
