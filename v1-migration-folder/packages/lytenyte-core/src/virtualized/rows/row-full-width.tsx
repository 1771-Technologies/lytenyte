import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowFullWidthRowLayout } from "../../+types";

export interface RowFullWidthProps {
  readonly row: RowFullWidthRowLayout;
}

const RowFullWidthImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & RowFullWidthProps
>(function RowFullWidth(props, forwarded) {
  return (
    <div
      {...props}
      ref={forwarded}
      style={{
        ...props.style,

        boxSizing: "border-box",
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

export const RowFullWidth = fastDeepMemo(RowFullWidthImpl);
