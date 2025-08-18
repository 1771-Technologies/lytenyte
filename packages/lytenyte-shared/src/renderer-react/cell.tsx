import { forwardRef, type JSX } from "react";
import type { Cell } from "./+types.renderer-react.js";
import { useCellStyle } from "./use-cell-style.js";

interface CellProps {
  readonly xPosition: Uint32Array;
  readonly yPosition: Uint32Array;
  readonly cell: Cell;
  readonly detailHeight: number;
  readonly viewportWidth: number;
  readonly rtl: boolean;
  readonly isEditing: boolean;
}

export const CellReact = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & CellProps>(
  function Cell(
    { cell, xPosition, yPosition, rtl, detailHeight, viewportWidth, isEditing, ...props },
    forwarded,
  ) {
    const style = useCellStyle(
      xPosition,
      yPosition,
      cell,
      rtl,
      detailHeight,
      viewportWidth,
      props.style,
    );

    return (
      <div
        {...props}
        ref={forwarded}
        role="gridcell"
        data-ln-rowindex={cell.rowIndex}
        data-ln-colindex={cell.colIndex}
        data-ln-colspan={cell.colSpan}
        data-ln-rowspan={cell.rowSpan}
        data-ln-pin={cell.colPin ?? "center"}
        data-ln-cell
        data-ln-last-top-pin={cell.rowLastPinTop}
        data-ln-first-bottom-pin={cell.rowFirstPinBottom}
        data-ln-last-start-pin={cell.colLastStartPin}
        data-ln-first-end-pin={cell.colFirstEndPin}
        tabIndex={isEditing ? -1 : 0}
        style={style}
      />
    );
  },
);
