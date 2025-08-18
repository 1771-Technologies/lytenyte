import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowNormalRowLayout } from "../../+types";
import { useGridRoot } from "../../context";
import { RowDetailRow } from "../row-detail-row";
import { RowReact, type DropWrapProps } from "@1771technologies/lytenyte-shared";
import { useRowContextValue } from "./use-row-context-value";
import { RowContext } from "./context";

export interface RowProps extends Omit<DropWrapProps, "accepted"> {
  readonly row: RowNormalRowLayout<any>;
  readonly accepted?: string[];
}

const empty: string[] = [];
const RowImpl = forwardRef<HTMLDivElement, Omit<JSX.IntrinsicElements["div"], "onDrag"> & RowProps>(
  function Rows({ row, ...props }, forwarded) {
    const ctx = useGridRoot().grid;

    const rowMeta = useRowContextValue(ctx, row.row);

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
          yPositions={ctx.state.yPositions.useValue()}
          data-ln-row-selected={rowMeta.selected}
        >
          {props.children}
          <RowDetailRow layout={row} />
        </RowReact>
      </RowContext.Provider>
    );
  },
);

export const Row = fastDeepMemo(RowImpl);
