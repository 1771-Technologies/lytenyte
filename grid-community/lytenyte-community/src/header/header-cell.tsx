import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useMemo, type CSSProperties } from "react";
import { getTransform } from "../renderer/get-transform";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { useHeaderCellRenderer } from "./use-header-cell-renderer";
import { dragState, useDraggable, useDroppable } from "@1771technologies/react-dragon";
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

  const gridId = api.getState().gridId.use();
  const dragProps = useDraggable({
    dragData: () => ({ columns: [column], columnIndex }),
    dragTags: () => [`${gridId}:grid:${column.pin ?? "none"}`],
    placeholder: () => <DragPlaceholder column={column} />,
  });

  const { canDrop, isOver, ...dropProps } = useDroppable({
    tags: [`${gridId}:grid:${column.pin ?? "none"}`],
    onDrop: (p) => {
      const data = p.getData() as { columns: ColumnCommunityReact<any>[]; columnIndex: number };
      const dragIndex = data.columnIndex;

      const isBefore = columnIndex < dragIndex;
      const src = data.columns.map((c) => c.id);
      const target = column.id;

      if (isBefore) api.columnMoveBefore(src, target);
      else api.columnMoveAfter(src, target);
    },
  });

  const dragData = dragState.dragData.use();
  const data = dragData?.();
  const dragIndex = ((data as any)?.columnIndex ?? -1) as number;
  const isBefore = columnIndex < dragIndex;

  const moveProps = api.columnIsMovable(column) ? dragProps : {};
  return (
    <div
      style={style}
      {...moveProps}
      {...dropProps}
      className={clsx(
        css`
          grid-column-start: 1;
          grid-column-end: 2;
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

function DragPlaceholder(c: { column: ColumnCommunityReact<any> }) {
  return (
    <div
      className={css`
        background-color: ${t.colors.backgrounds_light};
        padding: ${t.spacing.space_10} ${t.spacing.space_40};
        border: 1px solid ${t.colors.primary_50};
        border-radius: ${t.spacing.box_radius_medium};
        font-size: ${t.typography.body_m};
        font-family: ${t.typography.typeface_body};
      `}
    >
      {c.column.headerName ?? c.column.id}
    </div>
  );
}
