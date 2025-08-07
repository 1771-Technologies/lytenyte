import { forwardRef, type CSSProperties, type JSX } from "react";
import {
  SCROLL_WIDTH_VARIABLE,
  VIEWPORT_HEIGHT_VARIABLE,
  VIEWPORT_WIDTH_VARIABLE,
} from "../+constants.js";

interface RowsContainerProps {
  readonly height: number;
  readonly width: number;
  readonly viewportHeight: number;
  readonly viewportWidth: number;
}

export const RowsContainerReact = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & RowsContainerProps
>(function RowsContainer({ height, width, viewportHeight, viewportWidth, ...props }, forwarded) {
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
});
