import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowNormalRowLayout } from "../+types";
import { useGridRoot } from "../context";
import { RowDetailRow } from "./row-detail-row";
import { RowReact } from "@1771technologies/lytenyte-shared";

export interface RowProps {
  readonly row: RowNormalRowLayout<any>;
}

const RowImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowProps>(function Rows(
  { row, ...props },
  forwarded,
) {
  const ctx = useGridRoot().grid;

  return (
    <RowReact
      {...props}
      ref={forwarded}
      gridId={ctx.state.gridId.useValue()}
      rowIndex={row.rowIndex}
      rowFirstPinBottom={row.rowFirstPinBottom}
      rowLastPinTop={row.rowLastPinTop}
      rowIsFocusRow={row.rowIsFocusRow ?? false}
      yPositions={ctx.state.yPositions.useValue()}
    >
      {props.children}
      <RowDetailRow layout={row} />
    </RowReact>
  );
});

export const Row = fastDeepMemo(RowImpl);
