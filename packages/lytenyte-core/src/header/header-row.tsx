import { forwardRef, memo, type JSX } from "react";
import { useGridRoot } from "../context.js";

export interface HeaderRowProps {
  readonly headerRowIndex: number;
}

const HeaderRowImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & HeaderRowProps>(
  function HeaderRow({ headerRowIndex, ...props }, forwarded) {
    const maxRow = useGridRoot().grid.view.get().header.maxRow;

    return (
      <div
        {...props}
        ref={forwarded}
        role="row"
        data-ln-header-row
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
  },
);

export const HeaderRow = memo(HeaderRowImpl);
