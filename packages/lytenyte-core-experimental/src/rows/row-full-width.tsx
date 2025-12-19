import { forwardRef, memo, useMemo, type JSX } from "react";
import { sizeFromCoord, VIEWPORT_WIDTH_VARIABLE_USE } from "@1771technologies/lytenyte-shared";
import { RowDetailRow } from "./row-detail-row.js";
import type { LayoutFullWidthRow } from "../layout.js";
import { useRowStyle } from "./use-row-style.js";
import { useGridRoot } from "../root/context.js";
import { useRowsContainerContext } from "./rows-container/context.js";
import { $topHeight } from "../selectors/selectors.js";

export interface RowFullWidthProps {
  readonly row: LayoutFullWidthRow<any>;
  readonly accepted?: string[];
}

const RowFullWidthImpl = forwardRef<HTMLDivElement, Omit<JSX.IntrinsicElements["div"], "children"> & RowFullWidthProps>(
  function RowFullWidth({ row: layout, ...props }, forwarded) {
    const { id, rtl, columnMeta, yPositions, rowFullWidthRenderer, api } = useGridRoot();
    const container = useRowsContainerContext();

    const hasSpans = useMemo(() => {
      const visible = columnMeta.columnsVisible;
      return !visible.every((c) => !(c.colSpan || c.rowSpan));
    }, [columnMeta.columnsVisible]);

    const Renderer = rowFullWidthRenderer.useValue();

    const row = layout.row.useValue();

    const rowIndex = layout.rowIndex;
    const rowPin = layout.rowPin;

    const topOffset = container.useValue($topHeight);
    const rowIsFocusRow = !!layout.rowIsFocusRow;

    const rowDetailHeight = row ? api.rowDetailHeight(row) : 0;
    const height = sizeFromCoord(rowIndex, yPositions) - rowDetailHeight;

    return (
      <div
        {...props}
        role="row"
        /** Data attributes start */
        data-ln-gridid={id}
        data-ln-rowindex={rowIndex}
        data-ln-alternate={rowIndex % 2 === 1}
        data-ln-row
        data-ln-last-top-pin={layout.rowLastPinTop}
        data-ln-first-bottom-pin={layout.rowFirstPinBottom}
        data-ln-rowtype="full-width"
        /** Data attributes end */
        ref={forwarded}
        style={useRowStyle(yPositions, rowIndex, rowPin, topOffset, rowIsFocusRow, hasSpans, props.style)}
      >
        <div
          role="gridcell"
          tabIndex={0}
          style={{
            width: VIEWPORT_WIDTH_VARIABLE_USE,
            height,
            position: "sticky",
            right: rtl ? "0px" : undefined,
            left: rtl ? undefined : "0px",
            pointerEvents: "all",
          }}
        >
          {row && Renderer ? <Renderer api={api} row={row} rowIndex={layout.rowIndex} /> : null}
        </div>
        <RowDetailRow layout={layout} />
      </div>
    );
  },
);

export const RowFullWidth = memo(RowFullWidthImpl);
