import { forwardRef, memo, type JSX } from "react";
import { useRowContextValue } from "./use-row-context-value.js";
import { type LayoutRowWithCells } from "@1771technologies/lytenyte-shared";
import { RowContext } from "./context.js";
import { useRowStyle } from "../use-row-style.js";
import { RowDetailRow } from "../row-detail-row.js";
import { useMappedEvents } from "../../../hooks/use-mapped-events.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useOffsetContext } from "../../../root/contexts/grid-areas/offset-context.js";
import { useCellRangeSelectionPieceContext } from "../../../root/contexts/cell-range-selection/cell-range-selection-state.js";
import { useYCoordinates } from "../../../root/contexts/coordinates.js";
import { useAPI } from "../../../root/contexts/api-provider.js";
import { useStyleContext, useStyleSettings } from "../../../root/contexts/styles-context.js";
import { useGridEvents } from "../../../root/contexts/events-context.js";

const RowImpl = forwardRef<HTMLDivElement, Row.Props>(function Rows({ row, ...props }, forwarded) {
  const id = useGridIdContext();

  const sx = useStyleContext();
  const events = useGridEvents();
  const { rowAlternateAttr } = useStyleSettings();

  const api = useAPI();
  const cellSelections$ = useCellRangeSelectionPieceContext();

  const { topOffset, headerHeight } = useOffsetContext();

  const rowMeta = useRowContextValue(row);
  const topHeight = topOffset - headerHeight;

  const cellSelected = cellSelections$.useValue((x) =>
    x.some((r) => row.rowIndex >= r.rowStart && row.rowIndex < r.rowEnd),
  );

  const yPositions = useYCoordinates();
  const styles = useRowStyle(
    yPositions,
    row.rowIndex,
    row.rowPin,
    topHeight,
    rowMeta.detailHeight,
    props.style ?? sx?.row?.style,
  );

  const handlers = useMappedEvents(events.row, { row: rowMeta.row, api, layout: row });

  return (
    <RowContext.Provider value={rowMeta}>
      <div
        className={sx?.row?.className}
        {...handlers}
        {...props}
        role="row"
        ref={forwarded}
        style={styles}
        aria-selected={rowMeta.row?.__selected}
        aria-rowindex={row.rowIndex + 1}
        // Data Attributes
        data-ln-gridid={id}
        data-ln-rowindex={row.rowIndex}
        data-ln-rowpin={row.rowPin ?? "center"}
        data-ln-cell-selected={cellSelected}
        data-ln-rowtype="normal-row"
        data-ln-last-top-pin={row.rowLastPinTop}
        data-ln-first-bottom-pin={row.rowFirstPinBottom}
        data-ln-alternate={rowAlternateAttr ? row.rowIndex % 2 === 1 : undefined}
        data-ln-selected={rowMeta.row?.__selected}
        data-ln-row
      >
        {props.children}
        <RowDetailRow layout={row} />
      </div>
    </RowContext.Provider>
  );
});

export const Row = memo(RowImpl);

export namespace Row {
  export type Props = JSX.IntrinsicElements["div"] & {
    readonly row: LayoutRowWithCells;
  };
}
