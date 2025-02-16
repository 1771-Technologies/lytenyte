import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { getTransform } from "../../renderer/get-transform";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { useHeaderCellRenderer } from "../use-header-cell-renderer";
import { t } from "@1771technologies/grid-design";
import { useHeaderMove } from "../use-header-move";
import { COLUMN_EMPTY_PREFIX, HEADER_CELL } from "@1771technologies/grid-constants";
import { ExpandButton } from "../../components/buttons";
import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/community-react";
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
  readonly headerDefault: (p: ColumnHeaderRendererParamsReact<any>) => ReactNode;
}

export function HeaderCell({
  api,
  column,
  columnIndex,
  viewportWidth,
  rowStart,
  rowEnd,
  xPositions,
  headerDefault,
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

  const Renderer = useHeaderCellRenderer(api, column, headerDefault);

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
      <ExpandButton
        {...events}
        buttonRef={ref as any}
        onClick={() => {
          const id = column.id.replace(COLUMN_EMPTY_PREFIX, "").split("|>").slice(0, -1);

          api.columnGroupToggle(id.join(api.getState().columnGroupIdDelimiter.peek()));
        }}
        style={style}
        className={css`
          grid-column-start: 1;
          grid-column-end: 2;
          background-color: ${t.headerBg};
          color: ${t.headerFg};
          overflow: hidden;
          display: flex;
          height: 100% !important;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        `}
      >
        +
      </ExpandButton>
    );
  }

  const sortDir = api.columnSortDirection(column);
  return (
    <div
      style={style}
      ref={ref as any}
      role="columnheader"
      data-lng1771-column-id={column.id}
      aria-colindex={columnIndex + 1}
      aria-colspan={1}
      aria-sort={sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none"}
      tabIndex={-1}
      {...moveProps}
      {...dropProps}
      {...events}
      className={clsx(
        HEADER_CELL,
        css`
          overflow: hidden;
          grid-column-start: 1;
          grid-column-end: 2;

          border-bottom: 1px solid ${t.headerDividerX};
          background-color: ${t.headerBg};
          color: ${t.headerFg};
          box-sizing: border-box;

          font-size: ${t.headerFontSize};
          font-weight: ${t.headerFontWeight};
          font-family: ${t.headerFontTypeface};
        `,
        focusCellOutline,
        isOver &&
          columnIndex !== dragIndex &&
          css`
            &::after {
              top: 0px;
              position: absolute;
              width: 2px;
              border-radius: 9999px;
              height: 100%;
              content: "";
              background-color: var(--lng1771-allowed-to-drop, ${t.gridDragBarColor});
              z-index: 20;
            }
          `,
        isOver &&
          isBefore &&
          css`
            &::after {
              inset-inline-start: 1px;
            }
          `,
        isOver &&
          !isBefore &&
          css`
            &::after {
              inset-inline-end: 1px;
            }
          `,
        isOver &&
          !canDrop &&
          css`
            --lng1771-allowed-to-drop: ${t.gridDragBarNotAllowedColor};
          `,
      )}
    >
      <Renderer api={api} column={column} columnIndex={columnIndex} />
    </div>
  );
}

export const focusCellOutline = css`
  &:focus {
    outline: none;
  }
  &:focus::after {
    content: "";
    position: absolute;
    top: 0px;
    inset-inline-start: 1px;
    width: calc(100% - 2px);
    height: 100%;
    pointer-events: none;
    box-sizing: border-box;
    border: 1px solid ${t.gridFocusOutline};
    border-radius: 2px;
    z-index: 10;
  }
`;
