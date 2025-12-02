import { forwardRef, memo, type JSX } from "react";
import { useGridRoot } from "../../root/context.js";
import { useHeaderRow } from "./context.js";

function HeaderRowImpl(
  props: JSX.IntrinsicElements["div"],
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const { id, headerRowCount: maxRow } = useGridRoot();
  const headerRowIndex = useHeaderRow();

  return (
    <div
      {...props}
      ref={ref}
      role="row"
      data-ln-header-row
      data-ln-gridid={id}
      style={{
        boxSizing: "border-box",
        display: "grid",
        width: "100%",
        gridTemplateColumns: "subgrid",
        gridTemplateRows: "100%",
        gridRow: `${headerRowIndex + 1} / ${maxRow + 1}`,
        gridColumn: "1 / -1",
      }}
    />
  );
}

export const HeaderRow = memo(forwardRef(HeaderRowImpl));
