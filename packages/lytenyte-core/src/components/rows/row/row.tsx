import { forwardRef, memo, type JSX } from "react";
import { useRowContextValue } from "./use-row-context-value.js";
import { equal, type LayoutRowWithCells } from "@1771technologies/lytenyte-shared";
import { RowContext } from "./context.js";
import { useRoot } from "../../../root/root-context.js";
import { useRowsContainerContext } from "../rows-container/context.js";
import { $topHeight } from "../../../selectors.js";
import { useRowStyle } from "../use-row-style.js";
import { RowDetailRow } from "../row-detail-row.js";
import { useMappedEvents } from "../../../hooks/use-mapped-events.js";
import { useGridId } from "../../../root/contexts/grid-id.js";

const RowImpl = forwardRef<HTMLDivElement, Row.Props>(function Rows({ row, ...props }, forwarded) {
  const ctx = useRoot();
  const id = useGridId();
  const { rowAlternateAttr, yPositions, events, styles: sx, api, cellSelections$ } = ctx;

  const container = useRowsContainerContext();

  const rowMeta = useRowContextValue(row, ctx);
  const topOffset = container.useValue($topHeight);

  const cellSelected = cellSelections$.useValue((x) =>
    x.some((r) => row.rowIndex >= r.rowStart && row.rowIndex < r.rowEnd),
  );

  const styles = useRowStyle(
    yPositions,
    row.rowIndex,
    row.rowPin,
    topOffset,
    !!row.rowIsFocusRow,
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

export const Row = memo(RowImpl, (prev, next) => {
  const { row: rowP, ...propsP } = prev;
  const { row: rowN, ...propsN } = next;

  const { cells: _, ...rowPropsP } = rowP;
  const { cells: __, ...rowPropsN } = rowN;

  return equal(rowPropsN, rowPropsP) && equal(propsP, propsN);
});

export namespace Row {
  export type Props = JSX.IntrinsicElements["div"] & {
    readonly row: LayoutRowWithCells;
  };
}
