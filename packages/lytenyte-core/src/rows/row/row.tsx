import { forwardRef, memo, type JSX } from "react";
import type { RowNormalRowLayout } from "../../+types";
import { useGridRoot } from "../../context.js";
import { RowDetailRow } from "../row-detail-row.js";
import { useRowContextValue } from "./use-row-context-value.js";
import { equal } from "@1771technologies/lytenyte-shared";
import { CellSpacerNoPin } from "../../cells/cell-spacer.js";
import { useRowStyle } from "../use-row-style.js";
import { RowContext } from "./context.js";
import { DropWrap, type DropWrapProps } from "../../drag-and-drop/index.js";

export interface RowProps extends Omit<DropWrapProps, "accepted"> {
  readonly row: RowNormalRowLayout<any>;
  readonly accepted?: string[];
}

const empty: string[] = [];
const RowImpl = forwardRef<HTMLDivElement, Omit<JSX.IntrinsicElements["div"], "onDrag"> & RowProps>(
  function Rows({ row, ...props }, forwarded) {
    const { grid: ctx, gridId } = useGridRoot();

    const yPos = ctx.state.yPositions.useValue();
    const rowMeta = useRowContextValue(ctx, row, yPos);
    const hasSpans = ctx.internal.hasSpans.useValue();

    const accepted = props.accepted ?? empty;
    const topOffset = ctx.view.useValue().rows.rowTopTotalHeight;

    const styles = useRowStyle(
      yPos,
      row.rowIndex,
      row.rowPin,
      topOffset,
      !!row.rowIsFocusRow,
      hasSpans,
      props.style,
    );

    return (
      <RowContext.Provider value={rowMeta}>
        <DropWrap
          {...props}
          role="row"
          ref={forwarded}
          accepted={accepted}
          // Data Attributes
          data-ln-gridid={gridId}
          data-ln-rowindex={row.rowIndex}
          data-ln-rowtype="normal-row"
          data-ln-last-top-pin={row.rowLastPinTop}
          data-ln-first-bottom-pin={row.rowFirstPinBottom}
          data-ln-alternate={row.rowIndex % 2 === 1}
          data-ln-row
          style={styles}
        >
          <CellSpacerNoPin xPositions={rowMeta.xPositions} />
          {props.children}
          <RowDetailRow layout={row} />
        </DropWrap>
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
