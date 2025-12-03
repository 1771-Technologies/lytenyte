import { forwardRef, memo, useMemo, type JSX } from "react";
import { useRowContextValue } from "./use-row-context-value.js";
import { equal } from "@1771technologies/lytenyte-shared";
import { CellSpacerNoPin } from "../../cells/cell-spacer.js";
import { RowContext } from "./context.js";
import type { LayoutRowWithCells } from "../../types/layout";
import { useGridRoot } from "../../root/context.js";
import { RowDetailRow } from "../row-detail-row.js";
import { useRowStyle } from "../use-row-style.js";
import { useRowsContainerContext } from "../rows-container/context.js";
import { $topHeight } from "../../selectors/selectors.js";

export interface RowProps {
  readonly row: LayoutRowWithCells<any>;
  readonly accepted?: string[];
}

const RowImpl = forwardRef<HTMLDivElement, Omit<JSX.IntrinsicElements["div"], "onDrag"> & RowProps>(
  function Rows({ row, ...props }, forwarded) {
    const { id, yPositions, xPositions, columnMeta } = useGridRoot();
    const container = useRowsContainerContext();

    const hasSpans = useMemo(() => {
      const visible = columnMeta.columnsVisible;
      return !visible.every((c) => !(c.colSpan || c.rowSpan));
    }, [columnMeta.columnsVisible]);

    const rowMeta = useRowContextValue(row, yPositions, xPositions);
    const topOffset = container.useValue($topHeight);

    const styles = useRowStyle(
      yPositions,
      row.rowIndex,
      row.rowPin,
      topOffset,
      !!row.rowIsFocusRow,
      hasSpans,
      props.style,
    );

    return (
      <RowContext.Provider value={rowMeta}>
        <div
          {...props}
          role="row"
          ref={forwarded}
          // Data Attributes
          data-ln-gridid={id}
          data-ln-rowindex={row.rowIndex}
          data-ln-rowpin={row.rowPin ?? "center"}
          data-ln-rowtype="normal-row"
          data-ln-last-top-pin={row.rowLastPinTop}
          data-ln-first-bottom-pin={row.rowFirstPinBottom}
          data-ln-alternate={row.rowIndex % 2 === 1}
          data-ln-row
          style={styles}
        >
          <CellSpacerNoPin />
          {props.children}
          <RowDetailRow layout={row} />
        </div>
      </RowContext.Provider>
    );
  },
);

export const Row = memo(RowImpl, (prev, next) => {
  const { row: rowP, ...propsP } = prev;
  const { row: rowN, ...propsN } = next;

  const { cells: _, ...rowPropsP } = rowP;
  const { cells: __, ...rowPropsN } = rowN;

  return equal(rowPropsN, rowPropsP) && equal(propsP, propsN);
});
