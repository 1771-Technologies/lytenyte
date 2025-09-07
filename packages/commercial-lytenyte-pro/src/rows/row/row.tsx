import { forwardRef, memo, type JSX } from "react";
import type { RowNormalRowLayout } from "../../+types.js";
import { useGridRoot } from "../../context.js";
import { RowDetailRow } from "../row-detail-row.js";
import { RowReact, type DropWrapProps } from "@1771technologies/lytenyte-shared";
import { useRowContextValue } from "./use-row-context-value.js";
import { RowContext } from "./context.js";
import { equal } from "@1771technologies/lytenyte-js-utils";
import { CellSpacerNoPin } from "../../cells/cell-spacer.js";

export interface RowProps extends Omit<DropWrapProps, "accepted"> {
  readonly row: RowNormalRowLayout<any>;
  readonly accepted?: string[];
}

const empty: string[] = [];
const RowImpl = forwardRef<HTMLDivElement, Omit<JSX.IntrinsicElements["div"], "onDrag"> & RowProps>(
  function Rows({ row, ...props }, forwarded) {
    const ctx = useGridRoot().grid;

    const yPos = ctx.state.yPositions.useValue();
    const rowMeta = useRowContextValue(ctx, row.row, yPos);
    const hasSpans = ctx.internal.hasSpans.useValue();

    const accepted = props.accepted ?? empty;

    return (
      <RowContext.Provider value={rowMeta}>
        <RowReact
          {...props}
          ref={forwarded}
          accepted={accepted}
          gridId={ctx.state.gridId.useValue()}
          rowIndex={row.rowIndex}
          rowFirstPinBottom={row.rowFirstPinBottom}
          rowLastPinTop={row.rowLastPinTop}
          rowIsFocusRow={row.rowIsFocusRow ?? false}
          rowPin={row.rowPin}
          topOffset={ctx.view.useValue().rows.rowTopTotalHeight}
          yPositions={yPos}
          hasSpans={hasSpans}
          data-ln-row-selected={rowMeta.selected}
        >
          <CellSpacerNoPin xPositions={rowMeta.xPositions} />
          {props.children}
          <RowDetailRow layout={row} />
        </RowReact>
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
