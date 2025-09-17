import { forwardRef, type JSX } from "react";

interface HeaderRowProps {
  readonly maxRow: number;
  readonly headerRowIndex: number;
}

export const HeaderRowReact = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderRowProps
>(function HeaderRow({ maxRow, headerRowIndex, ...props }, forwarded) {
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
});
