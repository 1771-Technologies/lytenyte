import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowNormalRowLayout } from "../../+types";
import { useGridRoot } from "../context";
import { SCROLL_WIDTH_VARIABLE_USE } from "../+constants";
import { getTranslate } from "@1771technologies/lytenyte-shared";

export interface RowProps {
  readonly row: RowNormalRowLayout;
}

const RowImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowProps>(function Rows(
  { row, ...props },
  forwarded,
) {
  const cx = useGridRoot().grid.state;

  const yPositions = cx.yPositions.useValue();
  const height = yPositions[row.rowIndex + 1] - yPositions[row.rowIndex];
  const transform = getTranslate(0, yPositions[row.rowIndex]);

  return (
    <div
      {...props}
      ref={forwarded}
      style={{
        ...props.style,

        boxSizing: "border-box",
        height,
        width: SCROLL_WIDTH_VARIABLE_USE,
        transform,
        display: "grid",
        gridTemplateColumns: "0px",
        gridTemplateRows: "0px",
        gridColumnStart: "1",
        gridColumnEnd: "2",
        gridRowStart: "1",
        gridRowEnd: "2",
      }}
    />
  );
});

export const Row = fastDeepMemo(RowImpl);
