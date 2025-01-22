import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import { getTransform } from "../renderer/get-transform";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { useHeaderCellRenderer } from "./use-header-cell-renderer";
import { t } from "@1771technologies/grid-design";
import { useHeaderMove } from "./use-header-move";
import { COLUMN_EMPTY_PREFIX } from "@1771technologies/grid-constants";
import { ExpandButton } from "../components/buttons";
import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/community-react";

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

  const { moveProps, dropProps, isBefore, isOver, canDrop } = useHeaderMove(
    api,
    column,
    columnIndex,
  );

  // syncs
  const sx = api.getState();
  sx.sortModel.use();

  if (api.columnIsEmpty(column)) {
    return (
      <ExpandButton
        onClick={() => {
          const id = column.id.replace(COLUMN_EMPTY_PREFIX, "").split("|>").slice(0, -1);

          api.columnGroupToggle(id.join(api.getState().columnGroupIdDelimiter.peek()));
        }}
        style={style}
        className={css`
          grid-column-start: 1;
          grid-column-end: 2;
          background-color: ${t.colors.backgrounds_ui_panel};
          overflow: hidden;
          display: flex;
          height: 100% !important;
          align-items: center;
          justify-content: center;
          color: ${t.colors.text_dark};
          cursor: pointer;
        `}
      >
        +
      </ExpandButton>
    );
  }

  return (
    <div
      style={style}
      {...moveProps}
      {...dropProps}
      className={clsx(
        css`
          grid-column-start: 1;
          grid-column-end: 2;
          overflow: hidden;
        `,
        isOver &&
          css`
            &::after {
              top: 0px;
              position: absolute;
              width: 2px;
              border-radius: 9999px;
              height: 100%;
              content: "";
              background-color: var(--lng1771-allowed-to-drop, ${t.colors.primary_50});
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
            --lng1771-allowed-to-drop: ${t.colors.system_red_50};
          `,
      )}
    >
      <Renderer api={api} column={column} columnIndex={columnIndex} />
    </div>
  );
}
