import { forwardRef, memo, type CSSProperties, type JSX } from "react";
import {
  SCROLL_WIDTH_VARIABLE,
  VIEWPORT_HEIGHT_VARIABLE,
  VIEWPORT_WIDTH_VARIABLE,
} from "@1771technologies/lytenyte-shared";
import { useRoot } from "../../../root/root-context.js";
import { useRangeSelection } from "../../range-selection/use-range-selection.js";
import { useKeyboardRangeSelection } from "../../range-selection/use-keyboard-range-selection.js";
import { useCellFocusChange } from "../../range-selection/use-cell-focus-change.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useXCoordinates, useYCoordinates } from "../../../root/contexts/coordinates.js";
import { useAPI } from "../../../root/contexts/api-provider.js";
import { useViewportContext } from "../../../root/contexts/viewport/viewport-context.js";

export const RowsContainer = memo(
  forwardRef<HTMLDivElement, RowsContainer.Props>(function Rows(props, forwarded) {
    const id = useGridIdContext();
    const { dimensions, slotRowsOverlay: RowsOverlay, rtl } = useRoot();

    const { viewport } = useViewportContext();

    const api = useAPI();
    const xPositions = useXCoordinates();
    const yPositions = useYCoordinates();

    const height = yPositions.at(-1)!;
    const width = xPositions.at(-1)!;

    const onMouseDown = useRangeSelection(props.onMouseDown, viewport, rtl, api);
    const onKeyDownRange = useKeyboardRangeSelection();
    useCellFocusChange();

    return (
      <div
        {...props}
        ref={forwarded}
        data-ln-rows-container
        data-ln-gridid={id}
        role="presentation"
        onMouseDown={onMouseDown}
        onKeyDown={(e) => {
          props.onKeyDown?.(e);
          onKeyDownRange(e);
        }}
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
            [VIEWPORT_WIDTH_VARIABLE]: `${dimensions.innerWidth}px`,
            [VIEWPORT_HEIGHT_VARIABLE]: `${dimensions.innerHeight}px`,
          } as CSSProperties
        }
      >
        {dimensions.innerHeight !== 0 && (
          <>{typeof RowsOverlay === "function" ? <RowsOverlay api={api} /> : RowsOverlay}</>
        )}
        {props.children}
      </div>
    );
  }),
);

export namespace RowsContainer {
  export type Props = JSX.IntrinsicElements["div"];
}
