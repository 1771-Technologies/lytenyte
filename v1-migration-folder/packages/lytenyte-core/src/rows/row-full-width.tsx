import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowFullWidthRowLayout } from "../+types";
import { useRowStyle } from "./use-row-style";
import { VIEWPORT_WIDTH_VARIABLE_USE } from "../+constants";
import { useGridRoot } from "../context";

export interface RowFullWidthProps {
  readonly row: RowFullWidthRowLayout<any>;
  readonly space?: "viewport" | "scroll-width";
}

const RowFullWidthImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & RowFullWidthProps
>(function RowFullWidth({ row, space, ...props }, forwarded) {
  const gridId = useGridRoot().grid.state.gridId.useValue();
  return (
    <div
      {...props}
      role="none"
      /** Data attributes start */
      data-ln-gridid={gridId}
      data-ln-rowindex={row.rowIndex}
      data-ln-row
      data-ln-last-top-pin={row.rowLastPinTop}
      data-ln-first-bottom-pin={row.rowFirstPinBottom}
      data-ln-rowtype="full-width"
      /** Data attributes end */
      tabIndex={-1}
      ref={forwarded}
      style={useRowStyle(row, props.style, {
        left: "0px",
        border: "1px solid black",
        position: "sticky",
        width: space === "scroll-width" ? undefined : VIEWPORT_WIDTH_VARIABLE_USE,
        pointerEvents: "all",
      })}
    />
  );
});

export const RowFullWidth = fastDeepMemo(RowFullWidthImpl);
