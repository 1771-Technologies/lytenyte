import { forwardRef, type JSX } from "react";
import type { CellHeader } from "./+types.renderer-react";
import { useHeaderCellStyle } from "./use-header-cell-style";

interface HeaderGroupCellProps {
  readonly cell: CellHeader;
  readonly cellId: string;
  readonly xPositions: Uint32Array;
  readonly rtl: boolean;
  readonly viewportWidth: number;

  readonly height: number;
}

export const HeaderGroupCellReact = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderGroupCellProps
>(function HeaderGroupCell(
  { cell, cellId, xPositions, rtl, viewportWidth, height, ...props },
  forwarded,
) {
  const x = xPositions[cell.colStart];
  const width = xPositions[cell.colEnd] - x;

  const styles = useHeaderCellStyle(cell, xPositions, rtl, viewportWidth);

  return (
    <div
      {...props}
      tabIndex={0}
      ref={forwarded}
      role="columnheader"
      // Data attributes start
      data-ln-header-group
      data-ln-header-id={cellId}
      data-ln-header-range={`${cell.colStart},${cell.colStart + cell.colSpan}`}
      data-ln-rowindex={cell.rowStart}
      data-ln-colindex={cell.colStart}
      data-ln-header-pin={cell.colPin ?? "center"}
      data-ln-last-start-pin={cell.colLastStartPin}
      data-ln-first-end-pin={cell.colFirstEndPin}
      // Data attributes end
      style={{
        ...props.style,
        ...styles,
        gridRow: "1 / 2",
        gridColumn: "1 / 2",
        width,
        height,
        boxSizing: "border-box",
      }}
    ></div>
  );
});
