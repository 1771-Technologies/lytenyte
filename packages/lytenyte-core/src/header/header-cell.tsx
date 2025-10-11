import { forwardRef, memo, type CSSProperties, type JSX } from "react";
import type { HeaderCellFloating, HeaderCellLayout } from "../+types";
import { useGridRoot } from "../context.js";
import { COLUMN_MARKER_ID, sizeFromCoord } from "@1771technologies/lytenyte-shared";
import { useHeaderCellRenderer } from "./use-header-cell-renderer.js";
import { ResizeHandler } from "./resize-handler.js";
import { useDragMove } from "./use-drag-move.js";
import { useHeaderCellStyle } from "./use-header-cell-style.js";
import { useCombinedRefs, type SlotComponent } from "../hooks/index.js";

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
  const { grid, gridId } = useGridRoot();
  const ctx = grid.state;

  const xPositions = ctx.xPositions.useValue();

  const base = ctx.columnBase.useValue();

  const Renderer = useHeaderCellRenderer(cell);

  const resizable =
    cell.id === COLUMN_MARKER_ID
      ? false
      : (cell.column.uiHints?.resizable ?? base.uiHints?.resizable ?? false);

  const { ref, ...dragProps } = useDragMove(grid, cell, props.onDragStart);
  const combined = useCombinedRefs(forwarded, ref);

  const width = sizeFromCoord(cell.colStart, xPositions, cell.colSpan);
  const rowSpan = cell.rowEnd - cell.rowStart;

  return (
    <div
      {...props}
      {...dragProps}
      tabIndex={0}
      ref={combined}
      role="columnheader"
      // DATA Attributes Start
      data-ln-header-cell
      data-ln-header-floating={cell.kind === "floating" ? "true" : undefined}
      data-ln-header-id={cell.column.id}
      data-ln-gridid={gridId}
      data-ln-header-range={`${cell.colStart},${cell.colStart + cell.colSpan}`}
      data-ln-rowindex={cell.rowStart}
      data-ln-colindex={cell.colStart}
      data-ln-pin={cell.colPin ?? "center"}
      data-ln-last-start-pin={cell.colLastStartPin}
      data-ln-first-end-pin={cell.colFirstEndPin}
      // Data attributes end
      style={{
        ...props.style,
        ...useHeaderCellStyle(cell, xPositions),
        gridRowStart: 1,
        gridRowEnd: rowSpan + 1,
        width,
        height: "100%",
        boxSizing: "border-box",
      }}
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
    </div>
  );
});

export const HeaderCell = memo(HeaderCellImpl);
