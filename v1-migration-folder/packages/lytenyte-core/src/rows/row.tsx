import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowNormalRowLayout } from "../+types";
import { useRowStyle } from "./use-row-style";
import { useGridRoot } from "../context";
import { RowDetailRow } from "./row-detail-row";

export interface RowProps {
  readonly row: RowNormalRowLayout<any>;
}

const RowImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowProps>(function Rows(
  { row, ...props },
  forwarded,
) {
  const ctx = useGridRoot().grid;

  const gridId = ctx.state.gridId.useValue();

  return (
    <>
      <div
        {...props}
        role="row"
        /** Data attributes start */
        data-ln-gridid={gridId}
        data-ln-rowindex={row.rowIndex}
        data-ln-rowtype="normal-row"
        data-ln-last-top-pin={row.rowLastPinTop}
        data-ln-first-bottom-pin={row.rowFirstPinBottom}
        data-ln-row
        /** Data attributes end */
        ref={forwarded}
        style={useRowStyle(row, props.style)}
      >
        {props.children}
        <RowDetailRow layout={row} />
      </div>
    </>
  );
});

export const Row = fastDeepMemo(RowImpl);
