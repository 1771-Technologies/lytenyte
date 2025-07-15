import { forwardRef, type JSX } from "react";
import type { HeaderCellFloating, HeaderCellLayout } from "../+types";
import { useGridRoot } from "../context";
import { HeaderCellReact } from "@1771technologies/lytenyte-shared";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import { useHeaderCellRenderer } from "./use-header-cell-renderer";

export interface HeaderCellProps<T> {
  readonly cell: HeaderCellLayout<T> | HeaderCellFloating<T>;
}

const HeaderCellImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderCellProps<any>
>(function HeaderCell({ cell, children, ...props }, forwarded) {
  const grid = useGridRoot().grid;
  const ctx = grid.state;

  const xPositions = ctx.xPositions.useValue();

  const viewport = ctx.viewportWidthInner.useValue();
  const rtl = ctx.rtl.useValue();

  const Renderer = useHeaderCellRenderer(cell);

  return (
    <HeaderCellReact
      {...props}
      ref={forwarded}
      cell={cell}
      columnId={cell.column.id}
      viewportWidth={viewport}
      isFloating={cell.kind === "floating"}
      rtl={rtl}
      xPositions={xPositions}
    >
      {children == undefined ? <Renderer column={cell.column} grid={grid} /> : children}
    </HeaderCellReact>
  );
});

export const HeaderCell = fastDeepMemo(HeaderCellImpl);
