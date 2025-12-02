import { forwardRef, memo, type JSX } from "react";
import { useGridRoot } from "../root/context-grid.js";
import { useHeaderCellStyle } from "./use-header-cell-style.js";
import type { HeaderGroupCellLayout } from "../types/layout.js";

export interface HeaderGroupCellProps {
  readonly cell: HeaderGroupCellLayout;
}

const HeaderGroupCellImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderGroupCellProps
>(function HeaderCell({ cell, children, ...props }, ref) {
  const { id, xPositions, headerGroupHeight, columnGroupDefaultExpansion, columnGroupExpansions } =
    useGridRoot();

  const isExpanded = columnGroupExpansions[cell.id] ?? columnGroupDefaultExpansion;

  const x = xPositions[cell.colStart];
  const width = xPositions[cell.colEnd] - x;

  const styles = useHeaderCellStyle(cell, xPositions);

  const attrs = {
    [`data-ln-header-row-${cell.rowStart}`]: true,
  };

  return (
    <div
      {...props}
      tabIndex={0}
      ref={ref}
      role="columnheader"
      // Data attributes start
      data-ln-header-group
      data-ln-header-id={cell.id}
      data-ln-header-range={`${cell.colStart},${cell.colStart + cell.colSpan}`}
      data-ln-rowindex={cell.rowStart}
      data-ln-colindex={cell.colStart}
      data-ln-colspan={cell.colEnd - cell.colStart}
      data-ln-gridid={id}
      data-ln-colpin={cell.colPin ?? "center"}
      data-ln-last-start-pin={cell.colLastStartPin}
      data-ln-first-end-pin={cell.colFirstEndPin}
      data-ln-collapsible={cell.isCollapsible}
      data-ln-collapsed={!isExpanded}
      {...attrs}
      // Data attributes end
      style={{
        ...styles,
        gridRow: "1 / 2",
        width,
        height: headerGroupHeight,
        boxSizing: "border-box",
        opacity: (cell.isHiddenMove ?? false) ? 0 : undefined,
        ...props.style,
      }}
    >
      {children == undefined ? cell.id : children}
    </div>
  );
});

export const HeaderGroupCell = memo(HeaderGroupCellImpl);
