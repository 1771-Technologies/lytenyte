import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowNormalRowLayout } from "../../+types";
import { useRowStyle } from "./use-row-style";

export interface RowProps {
  readonly row: RowNormalRowLayout<any>;
}

const RowImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowProps>(function Rows(
  { row, ...props },
  forwarded,
) {
  return (
    <div
      {...props}
      role="row"
      data-rowindex={row.rowIndex}
      data-rowtype="normal-row"
      ref={forwarded}
      style={useRowStyle(row, props.style)}
    />
  );
});

export const Row = fastDeepMemo(RowImpl);
