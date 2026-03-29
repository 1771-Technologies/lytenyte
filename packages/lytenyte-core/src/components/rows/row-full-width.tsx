import { forwardRef, memo, type JSX } from "react";
import {
  sizeFromCoord,
  VIEWPORT_WIDTH_VARIABLE_USE,
  type LayoutFullWidthRow,
} from "@1771technologies/lytenyte-shared";
import { RowDetailRow } from "./row-detail-row.js";
import { useRowStyle } from "./use-row-style.js";
import { useRoot } from "../../root/root-context.js";
import { useMappedEvents } from "../../hooks/use-mapped-events.js";
import { useGridIdContext } from "../../root/contexts/grid-id.js";
import { useOffsetContext } from "../../root/contexts/grid-areas/offset-context.js";

const RowFullWidthImpl = forwardRef<HTMLDivElement, RowFullWidth.Props>(function RowFullWidth(
  { row: layout, ...props },
  forwarded,
) {
  const id = useGridIdContext();
  const {
    rtl,
    yPositions,
    rowFullWidthRenderer,
    rowAlternateAttr,
    api,
    source,
    detailExpansions,
    rowDetailHeight,
    rowDetailAutoHeightGuess,
    rowDetailHeightCache,
    events,
    styles,
  } = useRoot();
  const Renderer = rowFullWidthRenderer;
  const { topOffset, headerHeight } = useOffsetContext();

  const row = source.rowByIndex(layout.rowIndex).useValue();

  const handlers = useMappedEvents(events.row, { row, api, layout });

  const rowIndex = layout.rowIndex;
  const rowPin = layout.rowPin;

  const topHeight = topOffset - headerHeight;

  const detailExpanded = row && detailExpansions.has(row.id);
  const detailHeight = !detailExpanded
    ? 0
    : rowDetailHeight === "auto"
      ? (rowDetailHeightCache[row.id] ?? rowDetailAutoHeightGuess)
      : rowDetailHeight;
  const height = sizeFromCoord(rowIndex, yPositions) - detailHeight;

  return (
    <div
      className={styles?.row?.className}
      {...handlers}
      {...props}
      role="row"
      /** Data attributes start */
      data-ln-gridid={id}
      data-ln-rowindex={rowIndex}
      data-ln-alternate={rowAlternateAttr ? layout.rowIndex % 2 === 1 : undefined}
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
        topHeight,
        detailHeight,
        props.style ?? styles?.row?.style,
      )}
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
        {row && Renderer ? <Renderer api={api} row={row} rowIndex={layout.rowIndex} layout={layout} /> : null}
      </div>
      <RowDetailRow layout={layout} />
    </div>
  );
});

export const RowFullWidth = memo(RowFullWidthImpl);

export namespace RowFullWidth {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly row: LayoutFullWidthRow;
  };
}
