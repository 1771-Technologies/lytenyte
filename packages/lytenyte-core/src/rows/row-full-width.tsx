import { forwardRef, memo, type JSX } from "react";
import type { RowFullWidthRowLayout } from "../+types";
import { useGridRoot } from "../context.js";
import { sizeFromCoord, VIEWPORT_WIDTH_VARIABLE_USE } from "@1771technologies/lytenyte-shared";
import { RowDetailRow } from "./row-detail-row.js";
import { useRowContextValue } from "./row/use-row-context-value.js";
import { useRowStyle } from "./use-row-style.js";
import { DropWrap, type DropWrapProps } from "../drag-and-drop/index.js";

export interface RowFullWidthProps extends Omit<DropWrapProps, "accepted"> {
  readonly row: RowFullWidthRowLayout<any>;
  readonly space?: "viewport" | "scroll-width";
  readonly accepted?: string[];
}

const empty: string[] = [];
const RowFullWidthImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & RowFullWidthProps
>(function RowFullWidth({ row: layout, space, children, ...props }, forwarded) {
  const { grid, gridId } = useGridRoot();
  const Renderer = grid.state.rowFullWidthRenderer.useValue().fn;
  const row = layout.row.useValue();
  const yPositions = grid.state.yPositions.useValue();
  const hasSpans = grid.internal.hasSpans.useValue();

  const meta = useRowContextValue(grid, layout, yPositions);
  const rowIndex = layout.rowIndex;
  const rowPin = layout.rowPin;

  const rtl = meta.rtl;

  const topOffset = grid.view.useValue().rows.rowTopTotalHeight;
  const rowIsFocusRow = !!layout.rowIsFocusRow;
  const height = sizeFromCoord(rowIndex, yPositions) - grid.api.rowDetailRenderedHeight(row ?? "");

  return (
    <DropWrap
      {...props}
      role="row"
      accepted={props.accepted ?? empty}
      /** Data attributes start */
      data-ln-gridid={gridId}
      data-ln-rowindex={rowIndex}
      data-ln-alternate={rowIndex % 2 === 1}
      data-ln-row
      data-ln-last-top-pin={layout.rowLastPinTop}
      data-ln-first-bottom-pin={layout.rowFirstPinBottom}
      data-ln-rowtype="full-width"
      /** Data attributes end */
      ref={forwarded}
      style={useRowStyle(
        yPositions,
        rowIndex,
        rowPin,
        topOffset,
        rowIsFocusRow,
        hasSpans,
        props.style,
        {
          right: rtl ? "0px" : undefined,
          left: rtl ? undefined : "0px",
          position: "sticky",
          width: space === "scroll-width" ? undefined : VIEWPORT_WIDTH_VARIABLE_USE,
          gridTemplateColumns: `${space === "scroll-width" ? "100%" : VIEWPORT_WIDTH_VARIABLE_USE}`,
          pointerEvents: "all",
        },
      )}
    >
      <div
        role="gridcell"
        tabIndex={0}
        style={{
          width: "100%",
          height,
          gridColumnStart: "1",
          gridColumnEnd: "2",
          gridRowStart: "1",
          gridRowEnd: "2",
        }}
      >
        {children ??
          (row ? (
            <Renderer
              grid={grid}
              row={row}
              rowIndex={layout.rowIndex}
              rowSelected={meta.selected}
              rowIndeterminate={meta.indeterminate}
            />
          ) : null)}
      </div>
      <RowDetailRow layout={layout} />
    </DropWrap>
  );
});

export const RowFullWidth = memo(RowFullWidthImpl);
