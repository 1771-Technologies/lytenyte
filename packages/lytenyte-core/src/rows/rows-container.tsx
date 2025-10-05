import { forwardRef, memo, type CSSProperties, type JSX } from "react";
import { useGridRoot } from "../context.js";
import {
  SCROLL_WIDTH_VARIABLE,
  VIEWPORT_HEIGHT_VARIABLE,
  VIEWPORT_WIDTH_VARIABLE,
} from "@1771technologies/lytenyte-shared";

export const RowsContainer = memo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function Rows(props, forwarded) {
    const ctx = useGridRoot().grid;

    const height = ctx.state.heightTotal.useValue();
    const width = ctx.state.widthTotal.useValue();
    const viewportHeight = ctx.state.viewportHeightInner.useValue();
    const viewportWidth = ctx.state.viewportWidthInner.useValue();
    return (
      <div
        {...props}
        ref={forwarded}
        data-ln-rows-container
        role="presentation"
        style={
          {
            ...props.style,
            height,
            minHeight: height,
            width,
            minWidth: "100%",
            flex: "1",
            display: "flex",
            flexDirection: "column",
            userSelect: "none",
            msUserSelect: "none",
            [SCROLL_WIDTH_VARIABLE]: `${width}px`,
            [VIEWPORT_WIDTH_VARIABLE]: `${viewportWidth}px`,
            [VIEWPORT_HEIGHT_VARIABLE]: `${viewportHeight}px`,
          } as CSSProperties
        }
      />
    );
  }),
);
