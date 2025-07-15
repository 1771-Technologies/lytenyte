import { forwardRef, type JSX } from "react";
import type { HeaderGroupCellLayout } from "../+types";
import { useGridRoot } from "../context";
import { HeaderGroupCellReact } from "@1771technologies/lytenyte-shared";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";

export interface HeaderGroupCellProps {
  readonly cell: HeaderGroupCellLayout;
}

const HeaderGroupCellImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderGroupCellProps
>(function HeaderCell({ cell, children, ...props }, forwarded) {
  const ctx = useGridRoot().grid.state;

  return (
    <HeaderGroupCellReact
      {...props}
      ref={forwarded}
      cell={cell}
      cellId={cell.id}
      height={ctx.headerGroupHeight.useValue()}
      rtl={ctx.rtl.useValue()}
      viewportWidth={ctx.viewportWidthInner.useValue()}
      xPositions={ctx.xPositions.useValue()}
    >
      {children == undefined ? cell.id : children}
    </HeaderGroupCellReact>
  );
});

export const HeaderGroupCell = fastDeepMemo(HeaderGroupCellImpl);
