import { forwardRef, type JSX } from "react";
import type { CellHeader } from "./+types.renderer-react.js";
import { useHeaderCellStyle } from "./use-header-cell-style.js";

interface HeaderGroupCellProps {
  readonly cell: CellHeader;
  readonly cellId: string;
  readonly xPositions: Uint32Array;

  readonly isHiddenMove: boolean;

  readonly height: number;
}

export const HeaderGroupCellReact = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderGroupCellProps
>(function HeaderGroupCell(
  { cell, cellId, xPositions, height, isHiddenMove, ...props },
  forwarded,
) {
  const x = xPositions[cell.colStart];
  const width = xPositions[cell.colEnd] - x;

  const styles = useHeaderCellStyle(cell, xPositions);

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
      data-ln-colspan={cell.colEnd - cell.colStart}
      data-ln-pin={cell.colPin ?? "center"}
      data-ln-last-start-pin={cell.colLastStartPin}
      data-ln-first-end-pin={cell.colFirstEndPin}
      // Data attributes end
      style={{
        ...props.style,
        ...styles,
        gridRow: "1 / 2",
        width,
        height,
        boxSizing: "border-box",
        opacity: isHiddenMove ? 0 : undefined,
      }}
    ></div>
  );
});
