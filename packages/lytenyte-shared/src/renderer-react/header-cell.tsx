import { forwardRef, type JSX } from "react";
import type { CellHeader } from "./+types.renderer-react.js";
import { sizeFromCoord } from "../utils/size-from-coord.js";
import { useHeaderCellStyle } from "./use-header-cell-style.js";

interface HeaderCellProps {
  readonly cell: CellHeader;
  readonly isFloating: boolean;
  readonly columnId: string;
  readonly xPositions: Uint32Array;
  readonly viewportWidth: number;
  readonly rtl: boolean;
}

export const HeaderCellReact = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderCellProps
>(function HeaderCell(
  { cell, isFloating, xPositions, columnId, viewportWidth, rtl, ...props },
  forwarded,
) {
  const width = sizeFromCoord(cell.colStart, xPositions, cell.colSpan);
  const rowSpan = cell.rowEnd - cell.rowStart;

  return (
    <div
      {...props}
      tabIndex={0}
      ref={forwarded}
      role="columnheader"
      // DATA Attributes Start
      data-ln-header-cell
      data-ln-header-floating={isFloating ? "true" : undefined}
      data-ln-header-id={columnId}
      data-ln-header-range={`${cell.colStart},${cell.colStart + cell.colSpan}`}
      data-ln-rowindex={cell.rowStart}
      data-ln-colindex={cell.colStart}
      data-ln-pin={cell.colPin ?? "center"}
      data-ln-last-start-pin={cell.colLastStartPin}
      data-ln-first-end-pin={cell.colFirstEndPin}
      // Data attributes end
      style={{
        ...props.style,
        ...useHeaderCellStyle(cell, xPositions, rtl, viewportWidth),
        gridRowStart: 1,
        gridRowEnd: rowSpan + 1,
        gridColumn: "1 / 2",
        width,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {props.children}
    </div>
  );
});
