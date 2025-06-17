import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowCellLayout } from "../../+types";
import { useGridRoot } from "../context";
import { getTranslate } from "@1771technologies/lytenyte-shared";

export interface CellProps {
  readonly cell: RowCellLayout;
}

const CellImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & CellProps>(function Cell(
  { cell, ...props },
  forwarded,
) {
  const cx = useGridRoot().grid.state;
  const xPositions = cx.xPositions.useValue();
  const yPositions = cx.yPositions.useValue();

  const width = xPositions[cell.colIndex + 1] - xPositions[cell.colIndex];
  const height = yPositions[cell.rowIndex + 1] - yPositions[cell.rowIndex];
  const transform = getTranslate(xPositions[cell.colIndex], 0);

  return (
    <div
      {...props}
      ref={forwarded}
      style={{
        ...props.style,

        height,
        width,
        transform,
        boxSizing: "border-box",
        gridColumnStart: "1",
        gridColumnEnd: "2",
        gridRowStart: "1",
        gridRowEnd: "2",
      }}
    />
  );
});

export const Cell = fastDeepMemo(CellImpl);
