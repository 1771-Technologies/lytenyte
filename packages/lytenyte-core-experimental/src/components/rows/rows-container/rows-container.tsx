import { forwardRef, memo, useMemo, type CSSProperties, type JSX } from "react";
import {
  SCROLL_WIDTH_VARIABLE,
  VIEWPORT_HEIGHT_VARIABLE,
  VIEWPORT_WIDTH_VARIABLE,
} from "@1771technologies/lytenyte-shared";
import { RowsContainerContext, type RowsContainerContextType } from "./context.js";
import { useRoot } from "../../../root/root-context.js";
import { usePiece } from "../../../hooks/use-piece.js";

export const RowsContainer = memo(
  forwardRef<HTMLDivElement, RowsContainer.Props>(function Rows(props, forwarded) {
    const {
      id,
      source,
      view,
      xPositions,
      yPositions,
      dimensions,
      api,
      slotRowsOverlay: RowsOverlay,
    } = useRoot();

    const startWidth = xPositions[view.startCount];
    const endWidth = xPositions.at(-1)! - xPositions.at(-1 - view.endCount)!;
    const centerWidth = xPositions.at(-1)! - startWidth - endWidth;

    const rowTopCount = source.useTopCount();
    const rowBottomCount = source.useBottomCount();
    const rowCount = source.useRowCount();
    const height = yPositions.at(-1)!;
    const width = xPositions.at(-1)!;
    const bottomHeight = yPositions.at(-1)! - yPositions.at(-1 - rowBottomCount)!;
    const topHeight = yPositions.at(rowTopCount)!;
    const centerHeight = yPositions.at(-1)! - bottomHeight - topHeight;

    const value = useMemo<RowsContainerContextType>(() => {
      return {
        totalHeight: height,
        totalWidth: width,

        topHeight,
        centerHeight,
        bottomHeight,

        startWidth,
        centerWidth,
        endWidth,

        topCount: rowTopCount,
        centerCount: rowCount - rowTopCount - rowBottomCount,
        bottomCount: rowBottomCount,
      };
    }, [
      bottomHeight,
      centerHeight,
      centerWidth,
      endWidth,
      height,
      rowBottomCount,
      rowCount,
      rowTopCount,
      startWidth,
      topHeight,
      width,
    ]);

    return (
      <RowsContainerContext.Provider value={usePiece(value)}>
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
              [VIEWPORT_WIDTH_VARIABLE]: `${dimensions.innerWidth}px`,
              [VIEWPORT_HEIGHT_VARIABLE]: `${dimensions.innerHeight}px`,
            } as CSSProperties
          }
        >
          {typeof RowsOverlay === "function" ? <RowsOverlay api={api} /> : RowsOverlay}
          {props.children}
        </div>
      </RowsContainerContext.Provider>
    );
  }),
);

export namespace RowsContainer {
  export type Props = JSX.IntrinsicElements["div"];
}
