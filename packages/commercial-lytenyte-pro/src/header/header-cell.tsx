import { forwardRef, type CSSProperties, type JSX } from "react";
import type { HeaderCellFloating, HeaderCellLayout } from "../+types";
import { useGridRoot } from "../context";
import { COLUMN_MARKER_ID, HeaderCellReact } from "@1771technologies/lytenyte-shared";
import {
  fastDeepMemo,
  useCombinedRefs,
  type SlotComponent,
} from "@1771technologies/lytenyte-react-hooks";
import { useHeaderCellRenderer } from "./use-header-cell-renderer";
import { ResizeHandler } from "./resize-handler";
import { useDragMove } from "./use-drag-move";

export interface HeaderCellProps<T> {
  readonly cell: HeaderCellLayout<T> | HeaderCellFloating<T>;
  readonly resizerAs?: SlotComponent;
  readonly resizerClassName?: string;
  readonly resizerStyle?: CSSProperties;
}

const HeaderCellImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderCellProps<any>
>(function HeaderCell(
  { cell, resizerAs, resizerStyle, resizerClassName, children, ...props },
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

  const { ref, ...dragProps } = useDragMove(grid, cell, props.onDragStart);
  const combined = useCombinedRefs(forwarded, ref);

  return (
    <HeaderCellReact
      {...props}
      {...dragProps}
      ref={combined}
      cell={cell}
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
          as={resizerAs}
          className={resizerClassName}
          style={resizerStyle}
        />
      )}
    </HeaderCellReact>
  );
});

export const HeaderCell = fastDeepMemo(HeaderCellImpl);
