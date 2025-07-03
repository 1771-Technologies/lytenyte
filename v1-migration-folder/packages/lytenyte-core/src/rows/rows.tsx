import { forwardRef, type CSSProperties, type JSX } from "react";
import { useGridRoot } from "../context";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import {
  SCROLL_WIDTH_VARIABLE,
  VIEWPORT_HEIGHT_VARIABLE,
  VIEWPORT_WIDTH_VARIABLE,
} from "../+constants";

export const RowsContainer = fastDeepMemo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function Rows(props, forwarded) {
    const ctx = useGridRoot().grid;

    const height = ctx.state.heightTotal.useValue();
    const width = ctx.state.widthTotal.useValue();

    const viewportHeight = ctx.state.viewportHeightInner.useValue();
    const viewportWidth = ctx.state.viewportWidthInner.useValue();

    return (
      <div
        {...props}
        role="none"
        ref={forwarded}
        style={
          {
            ...props.style,
            height,
            width,
            minWidth: "100%",
            flex: "1",
            display: "flex",
            flexDirection: "column",
            [SCROLL_WIDTH_VARIABLE]: `${width}px`,
            [VIEWPORT_WIDTH_VARIABLE]: `${viewportWidth}px`,
            [VIEWPORT_HEIGHT_VARIABLE]: `${viewportHeight}px`,
          } as CSSProperties
        }
      />
    );
  }),
);
