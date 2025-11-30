import { forwardRef, memo, type CSSProperties, type JSX } from "react";
import { useGridRoot } from "../context.js";
import {
  SCROLL_WIDTH_VARIABLE,
  VIEWPORT_HEIGHT_VARIABLE,
  VIEWPORT_WIDTH_VARIABLE,
} from "@1771technologies/lytenyte-shared";

export const RowsContainer = memo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function Rows(props, forwarded) {
    const { grid, gridId } = useGridRoot();

    const height = grid.state.heightTotal.useValue();
    const width = grid.state.widthTotal.useValue();
    const viewportHeight = grid.state.viewportHeightInner.useValue();
    const viewportWidth = grid.state.viewportWidthInner.useValue();
    return (
      <div
        {...props}
        ref={forwarded}
        data-ln-rows-container
        data-ln-gridid={gridId}
        role="presentation"
        style={
          {
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
            ...props.style,
          } as CSSProperties
        }
      />
    );
  }),
);
