import { forwardRef, memo, type JSX } from "react";
import { useHeaderRow } from "./context.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useColumnsContext } from "../../../root/contexts/columns/column-context.js";

function HeaderRowImpl(props: HeaderRow.Props, ref: HeaderRow.Props["ref"]) {
  const id = useGridIdContext();
  const { view } = useColumnsContext();
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
        gridRow: `${headerRowIndex + 1} / ${view.maxRow + 1}`,
        gridColumn: "1 / -1",
        ...props.style,
      }}
    />
  );
}

export const HeaderRow = memo(forwardRef(HeaderRowImpl));

export namespace HeaderRow {
  export type Props = JSX.IntrinsicElements["div"];
}
