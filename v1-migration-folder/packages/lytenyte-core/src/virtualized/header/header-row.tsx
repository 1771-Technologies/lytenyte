import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useGridRoot } from "../context";

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
        style={{
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "0px",
          gridTemplateRows: "100%",
          gridRow: `${headerRowIndex + 1} / ${maxRow + 1}`,
          gridColumn: "1 / 2",
        }}
      />
    );
  },
);

export const HeaderRow = fastDeepMemo(HeaderRowImpl);
