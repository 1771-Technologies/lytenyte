import { forwardRef, type CSSProperties, type JSX } from "react";
import { useGridRoot } from "../context";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import { SCROLL_WIDTH_VARIABLE } from "../+constants";

const RowsImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function Rows(props, forwarded) {
    const ctx = useGridRoot().grid;

    const height = ctx.state.heightTotal.useValue();
    const width = ctx.state.widthTotal.useValue();

    return (
      <div
        {...props}
        ref={forwarded}
        style={
          {
            ...props.style,
            height,
            width,
            display: "grid",
            gridTemplateRows: "0px",
            gridTemplateColumns: "0px",
            [SCROLL_WIDTH_VARIABLE]: `${width}px`,
          } as CSSProperties
        }
      />
    );
  },
);

export const Rows = fastDeepMemo(RowsImpl);
