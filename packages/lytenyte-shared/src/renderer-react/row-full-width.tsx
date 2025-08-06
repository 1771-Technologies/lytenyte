import { forwardRef, type JSX, type ReactNode } from "react";
import { useRowStyle } from "./use-row-style";
import { sizeFromCoord } from "../utils/size-from-coord";
import { VIEWPORT_WIDTH_VARIABLE_USE } from "../+constants";
import { DropWrap, type DropWrapProps } from "@1771technologies/lytenyte-dragon";

interface RowFullWidthProps extends DropWrapProps {
  readonly space?: "viewport" | "scroll-width";
  readonly rowIndex: number;
  readonly rowLastPinTop: boolean | undefined;
  readonly rowFirstPinBottom: boolean | undefined;
  readonly gridId: string;

  readonly yPositions: Uint32Array;
  readonly rowIsFocusRow: boolean;

  readonly detail: ReactNode;
  readonly detailHeight: number;

  readonly rtl: boolean;
}

export const RowFullWidthReact = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "onDrag"> & RowFullWidthProps
>(function RowFullWidth(
  {
    children,
    detail,
    rowIndex,
    rowFirstPinBottom,
    rowIsFocusRow,
    rowLastPinTop,
    gridId,
    yPositions,
    space,
    rtl,
    detailHeight,
    ...props
  },
  forwarded,
) {
  const height = sizeFromCoord(rowIndex, yPositions) - detailHeight;

  return (
    <DropWrap
      {...props}
      role="row"
      /** Data attributes start */
      data-ln-gridid={gridId}
      data-ln-rowindex={rowIndex}
      data-ln-row
      data-ln-last-top-pin={rowLastPinTop}
      data-ln-first-bottom-pin={rowFirstPinBottom}
      data-ln-rowtype="full-width"
      /** Data attributes end */
      tabIndex={-1}
      ref={forwarded}
      style={useRowStyle(yPositions, rowIndex, rowIsFocusRow, props.style, {
        right: rtl ? "0px" : undefined,
        left: rtl ? undefined : "0px",
        border: "1px solid black",
        position: "sticky",
        width: space === "scroll-width" ? undefined : VIEWPORT_WIDTH_VARIABLE_USE,
        gridTemplateColumns: `${space === "scroll-width" ? "100%" : VIEWPORT_WIDTH_VARIABLE_USE}`,
        pointerEvents: "all",
      })}
    >
      <div
        role="gridcell"
        style={{
          width: "100%",
          height,
          gridColumnStart: "1",
          gridColumnEnd: "2",
          gridRowStart: "1",
          gridRowEnd: "2",
        }}
      >
        {children}
      </div>
      {detail}
    </DropWrap>
  );
});
