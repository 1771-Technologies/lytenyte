import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useGridRoot } from "../context";
import { HeaderRowReact } from "@1771technologies/lytenyte-shared";

export interface HeaderRowProps {
  readonly headerRowIndex: number;
}

const HeaderRowImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & HeaderRowProps>(
  function HeaderRow(props, forwarded) {
    const maxRow = useGridRoot().grid.view.get().header.maxRow;

    return <HeaderRowReact {...props} ref={forwarded} maxRow={maxRow} />;
  },
);

export const HeaderRow = fastDeepMemo(HeaderRowImpl);
