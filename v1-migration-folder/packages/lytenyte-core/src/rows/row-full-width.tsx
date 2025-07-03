import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowFullWidthRowLayout } from "../+types";
import { useRowStyle } from "./use-row-style";
import { VIEWPORT_WIDTH_VARIABLE_USE } from "../+constants";

export interface RowFullWidthProps {
  readonly row: RowFullWidthRowLayout<any>;
  readonly space?: "viewport" | "scroll-width";
}

const RowFullWidthImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & RowFullWidthProps
>(function RowFullWidth({ row, space, ...props }, forwarded) {
  return (
    <div
      {...props}
      role="none"
      data-rowindex={row.rowIndex}
      data-rowtype="full-width"
      ref={forwarded}
      style={useRowStyle(row, props.style, {
        left: "0px",
        border: "1px solid black",
        position: "sticky",
        width: space === "scroll-width" ? undefined : VIEWPORT_WIDTH_VARIABLE_USE,
      })}
    />
  );
});

export const RowFullWidth = fastDeepMemo(RowFullWidthImpl);
