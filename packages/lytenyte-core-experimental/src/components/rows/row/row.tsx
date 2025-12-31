import { forwardRef, memo, useMemo, type JSX } from "react";
import { useRowContextValue } from "./use-row-context-value.js";
import { equal, type LayoutRowWithCells } from "@1771technologies/lytenyte-shared";
import { RowContext } from "./context.js";
import { useRoot } from "../../../root/root-context.js";
import { useRowsContainerContext } from "../rows-container/context.js";
import { $topHeight } from "../../../selectors.js";
import { useRowStyle } from "../use-row-style.js";
import { RowDetailRow } from "../row-detail-row.js";
import { CellSpacerCenter } from "../../cells/cell-spacers/cell-spacer-center.js";
import { useMappedEvents } from "../../../hooks/use-mapped-events.js";

const RowImpl = forwardRef<HTMLDivElement, Row.Props>(function Rows({ row, ...props }, forwarded) {
  const ctx = useRoot();
  const { id, yPositions, xPositions, view, editMode, events } = ctx;

  const container = useRowsContainerContext();

  const hasSpans = useMemo(() => {
    const visible = view.visibleColumns;
    // @ts-expect-error this could be defined, but we don't full type it for simplicity.
    return !visible.every((c) => !(c.colSpan || c.rowSpan));
  }, [view.visibleColumns]);

  const rowMeta = useRowContextValue(row, ctx);
  const topOffset = container.useValue($topHeight);

  const styles = useRowStyle(
    yPositions,
    row.rowIndex,
    row.rowPin,
    topOffset,
    !!row.rowIsFocusRow,
    hasSpans,
    rowMeta.detailHeight,
    props.style,
  );

  const handlers = useMappedEvents(events.row, rowMeta.row);

  return (
    <RowContext.Provider value={rowMeta}>
      <div
        {...props}
        {...handlers}
        role="row"
        onBlur={
          !rowMeta.isEditing || editMode !== "row"
            ? (props.onBlur ?? handlers.onBlur)
            : (ev) => {
                (props.onBlur ?? handlers.onBlur)?.(ev);

                if (ev.currentTarget !== ev.relatedTarget && ev.currentTarget.contains(ev.relatedTarget))
                  return;

                rowMeta.commit();
                return;
              }
        }
        ref={forwarded}
        style={styles}
        // Data Attributes
        data-ln-gridid={id}
        data-ln-rowindex={row.rowIndex}
        data-ln-rowpin={row.rowPin ?? "center"}
        data-ln-rowtype="normal-row"
        data-ln-last-top-pin={row.rowLastPinTop}
        data-ln-first-bottom-pin={row.rowFirstPinBottom}
        data-ln-alternate={row.rowIndex % 2 === 1}
        data-ln-selected={rowMeta.row?.__selected}
        data-ln-row
      >
        <CellSpacerCenter rowMeta={rowMeta} visibleStartCount={view.startCount} xPositions={xPositions} />
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
