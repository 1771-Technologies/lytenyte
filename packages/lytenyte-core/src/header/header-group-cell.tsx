import { forwardRef, memo, type JSX } from "react";
import type { HeaderGroupCellLayout } from "../+types";
import { useGridRoot } from "../context.js";
import { useDragMove } from "./use-drag-move.js";
import { useHeaderCellStyle } from "./use-header-cell-style.js";
import { useCombinedRefs } from "../hooks/index.js";

export interface HeaderGroupCellProps {
  readonly cell: HeaderGroupCellLayout;
}

const HeaderGroupCellImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderGroupCellProps
>(function HeaderCell({ cell, children, ...props }, forwarded) {
  const { grid, gridId } = useGridRoot();
  const ctx = grid.state;

  const { ref, ...dragProps } = useDragMove(grid, cell, props.onDragStart);

  const combined = useCombinedRefs(ref, forwarded);

  const isExpanded =
    grid.state.columnGroupExpansions.useValue()[cell.id] ??
    grid.state.columnGroupDefaultExpansion.get();

  const xPositions = ctx.xPositions.useValue();
  const x = xPositions[cell.colStart];
  const width = xPositions[cell.colEnd] - x;

  const styles = useHeaderCellStyle(cell, xPositions);

  return (
    <div
      {...props}
      {...dragProps}
      tabIndex={0}
      ref={combined}
      role="columnheader"
      // Data attributes start
      data-ln-header-group
      data-ln-header-id={cell.id}
      data-ln-header-range={`${cell.colStart},${cell.colStart + cell.colSpan}`}
      data-ln-rowindex={cell.rowStart}
      data-ln-colindex={cell.colStart}
      data-ln-colspan={cell.colEnd - cell.colStart}
      data-ln-gridid={gridId}
      data-ln-colpin={cell.colPin ?? "center"}
      data-ln-last-start-pin={cell.colLastStartPin}
      data-ln-first-end-pin={cell.colFirstEndPin}
      data-ln-collapsible={cell.isCollapsible}
      data-ln-collapsed={!isExpanded}
      // Data attributes end
      style={{
        ...props.style,
        ...styles,
        gridRow: "1 / 2",
        width,
        height: ctx.headerGroupHeight.useValue(),
        boxSizing: "border-box",
        opacity: (cell.isHiddenMove ?? false) ? 0 : undefined,
      }}
    >
      {children == undefined ? cell.id : children}
    </div>
  );
});

export const HeaderGroupCell = memo(HeaderGroupCellImpl);
