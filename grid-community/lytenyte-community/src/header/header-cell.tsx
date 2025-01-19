import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useMemo, type CSSProperties } from "react";
import { getTransform } from "../renderer/get-transform";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { useHeaderCellRenderer } from "./use-header-cell-renderer";
import { t } from "@1771technologies/grid-design";

interface HeaderCellProps {
  readonly api: ApiCommunityReact<any>;
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
  api,
  column,
  columnIndex,
  viewportWidth,
  rowStart,
  rowEnd,
  xPositions,
}: HeaderCellProps) {
  const isStart = column.pin === "start";
  const isEnd = column.pin === "end";
  const style = useMemo(() => {
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
  }, [columnIndex, isEnd, isStart, rowEnd, rowStart, viewportWidth, xPositions]);

  const Renderer = useHeaderCellRenderer(api, column);

  return (
    <div
      style={style}
      className={css`
        grid-column-start: 1;
        grid-column-end: 2;
      `}
    >
      <Renderer api={api} column={column} columnIndex={columnIndex} />
      <div
        className={clsx(
          !isEnd &&
            css`
              inset-inline-end: 0px;
            `,
          isEnd &&
            css`
              inset-inline-start: 0px;
            `,
          css`
            position: absolute;
            width: 1px;
            height: calc(100% - 12px);
            background-color: ${t.colors.borders_pin_separator};
            top: 6px;
          `,
        )}
      />
    </div>
  );
}
