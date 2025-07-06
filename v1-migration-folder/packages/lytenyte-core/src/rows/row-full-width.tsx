import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowFullWidthRowLayout } from "../+types";
import { useRowStyle } from "./use-row-style";
import { VIEWPORT_WIDTH_VARIABLE_USE } from "../+constants";
import { useGridRoot } from "../context";

export interface RowFullWidthProps {
  readonly row: RowFullWidthRowLayout<any>;
  readonly space?: "viewport" | "scroll-width";
}

const RowFullWidthImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & RowFullWidthProps
>(function RowFullWidth({ row, space, children, ...props }, forwarded) {
  const grid = useGridRoot().grid;
  const gridId = grid.state.gridId.useValue();
  const rtl = grid.state.rtl.useValue();

  const Renderer = grid.state.rowFullWidthRenderer.useValue().fn;

  const r = row.row.useValue();

  return (
    <div
      {...props}
      role="row"
      /** Data attributes start */
      data-ln-gridid={gridId}
      data-ln-rowindex={row.rowIndex}
      data-ln-row
      data-ln-last-top-pin={row.rowLastPinTop}
      data-ln-first-bottom-pin={row.rowFirstPinBottom}
      data-ln-rowtype="full-width"
      /** Data attributes end */
      tabIndex={-1}
      ref={forwarded}
      style={useRowStyle(row, props.style, {
        right: rtl ? "0px" : undefined,
        left: rtl ? undefined : "0px",
        border: "1px solid black",
        position: "sticky",
        width: space === "scroll-width" ? undefined : VIEWPORT_WIDTH_VARIABLE_USE,
        gridTemplateColumns: `${space === "scroll-width" ? "100%" : VIEWPORT_WIDTH_VARIABLE_USE}`,
        pointerEvents: "all",
      })}
    >
      <div role="gridcell" style={{ width: "100%", height: "100%" }}>
        {children ?? (r ? <Renderer grid={grid} row={r} rowIndex={row.rowIndex} /> : null)}
      </div>
    </div>
  );
});

export const RowFullWidth = fastDeepMemo(RowFullWidthImpl);
