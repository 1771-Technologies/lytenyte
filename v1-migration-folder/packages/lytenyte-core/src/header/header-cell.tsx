import { forwardRef, type CSSProperties, type JSX } from "react";
import type { HeaderCellFloating, HeaderCellLayout } from "../+types";
import { useGridRoot } from "../context";
import { COLUMN_MARKER_ID, HeaderCellReact, useDraggable } from "@1771technologies/lytenyte-shared";
import {
  fastDeepMemo,
  useForkRef,
  type SlotComponent,
} from "@1771technologies/lytenyte-react-hooks";
import { useHeaderCellRenderer } from "./use-header-cell-renderer";
import { ResizeHandler } from "./resize-handler";

export interface HeaderCellProps<T> {
  readonly cell: HeaderCellLayout<T> | HeaderCellFloating<T>;
  readonly resizerSlot?: SlotComponent;
  readonly resizerClassName?: string;
  readonly resizerStyle?: CSSProperties;
}

const HeaderCellImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderCellProps<any>
>(function HeaderCell(
  { cell, resizerSlot, resizerStyle, resizerClassName, children, ...props },
  forwarded,
) {
  const grid = useGridRoot().grid;
  const ctx = grid.state;

  const xPositions = ctx.xPositions.useValue();

  const viewport = ctx.viewportWidthInner.useValue();
  const rtl = ctx.rtl.useValue();
  const base = ctx.columnBase.useValue();

  const Renderer = useHeaderCellRenderer(cell);

  const resizable =
    cell.id === COLUMN_MARKER_ID
      ? false
      : (cell.column.uiHints?.resizable ?? base.uiHints?.resizable ?? false);

  const movable =
    cell.id === COLUMN_MARKER_ID
      ? false
      : (cell.column.uiHints?.movable ?? base.uiHints?.movable ?? false);

  const { dragProps } = useDraggable({
    getItems: () => {
      const gridId = grid.state.gridId.get();
      return {
        siteLocalData: {
          [`column-move-${gridId}`]: {
            columns: [cell.column],
          },
        },
      };
    },
  });

  const ref = useForkRef(forwarded, dragProps.ref);

  return (
    <HeaderCellReact
      {...props}
      ref={ref}
      cell={cell}
      draggable={movable ? dragProps.draggable : undefined}
      onDragStart={
        movable
          ? (ev) => {
              props.onDragStart?.(ev);
              dragProps.onDragStart(ev);
            }
          : undefined
      }
      columnId={cell.column.id}
      viewportWidth={viewport}
      isFloating={cell.kind === "floating"}
      rtl={rtl}
      xPositions={xPositions}
    >
      {children == undefined ? <Renderer column={cell.column} grid={grid} /> : children}
      {resizable && cell.kind === "cell" && (
        <ResizeHandler
          cell={cell}
          xPositions={xPositions}
          slot={resizerSlot}
          className={resizerClassName}
          style={resizerStyle}
        />
      )}
    </HeaderCellReact>
  );
});

export const HeaderCell = fastDeepMemo(HeaderCellImpl);
