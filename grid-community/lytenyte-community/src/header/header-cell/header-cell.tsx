import "./header-cell.css";
import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useMemo, useRef, type CSSProperties } from "react";
import { getTransform } from "../../utils/get-transform";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { useHeaderCellRenderer } from "./use-header-cell-renderer";
import { useHeaderMove } from "./use-header-move";
import { COLUMN_EMPTY_PREFIX } from "@1771technologies/grid-constants";
import { useHeaderFocus } from "./use-header-focus";

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

  const rtl = api.getState().rtl.use();
  const style = useMemo(() => {
    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + viewportWidth
      : xPositions[columnIndex];

    const width = sizeFromCoord(columnIndex, xPositions);
    const style = {
      transform: getTransform(x * (rtl ? -1 : 1), 0),
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
  }, [columnIndex, isEnd, isStart, rowEnd, rowStart, rtl, viewportWidth, xPositions]);

  const Renderer = useHeaderCellRenderer(api, column);

  const { moveProps, dropProps, isBefore, isOver, canDrop, dragIndex } = useHeaderMove(
    api,
    column,
    columnIndex,
  );

  // syncs
  const sx = api.getState();
  sx.sortModel.use();
  const ref = useRef<HTMLElement | null>(null);

  const events = useHeaderFocus(api, ref, columnIndex);

  if (api.columnIsEmpty(column)) {
    return (
      <button
        {...events}
        ref={ref as any}
        onClick={() => {
          const id = column.id.replace(COLUMN_EMPTY_PREFIX, "").split("|>").slice(0, -1);

          api.columnGroupToggle(id.join(api.getState().columnGroupIdDelimiter.peek()));
        }}
        style={style}
        className="lng1771-header__cell-expand"
      >
        +
      </button>
    );
  }

  const sortDir = api.columnSortDirection(column);
  return (
    <div
      style={style}
      ref={ref as any}
      role="columnheader"
      data-lng1771-column-id={column.id}
      data-lng1771-kind="header"
      aria-colindex={columnIndex + 1}
      aria-colspan={1}
      aria-sort={sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none"}
      tabIndex={-1}
      {...moveProps}
      {...dropProps}
      {...events}
      className={clsx(
        "lng1771-header__cell",
        isOver && columnIndex !== dragIndex && "lng1771-header__cell--over",
        isOver && isBefore && "lng1771-header__cell--over-before",
        isOver && !isBefore && "lng1771-header__cell--over-after",
        isOver && !canDrop && "lng1771-header__cell--over-not-allowed",
      )}
    >
      <Renderer api={api} column={column} />
    </div>
  );
}
