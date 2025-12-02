import { forwardRef, memo, type CSSProperties, type JSX } from "react";
import {
  SCROLL_WIDTH_VARIABLE,
  VIEWPORT_HEIGHT_VARIABLE,
  VIEWPORT_WIDTH_VARIABLE,
} from "@1771technologies/lytenyte-shared";
import { useGridRoot } from "../root/context.js";

export const RowsContainer = memo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function Rows(props, forwarded) {
    const { id, xPositions, yPositions, vpInnerWidth, vpInnerHeight } = useGridRoot();

    const height = yPositions.at(-1)!;
    const width = xPositions.at(-1)!;

    return (
      <div
        {...props}
        ref={forwarded}
        data-ln-rows-container
        data-ln-gridid={id}
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
            [VIEWPORT_WIDTH_VARIABLE]: `${vpInnerWidth}px`,
            [VIEWPORT_HEIGHT_VARIABLE]: `${vpInnerHeight}px`,
          } as CSSProperties
        }
      />
    );
  }),
);
