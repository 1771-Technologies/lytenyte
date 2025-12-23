import { forwardRef, memo, type JSX } from "react";
import { useHeaderRow } from "./context.js";
import { useRoot } from "../../../root/root-context.js";

function HeaderRowImpl(props: HeaderRow.Props, ref: HeaderRow.Props["ref"]) {
  const { id, view } = useRoot();
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
