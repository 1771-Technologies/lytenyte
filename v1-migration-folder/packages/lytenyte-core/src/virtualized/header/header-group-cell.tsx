import { forwardRef, type JSX } from "react";
import type { HeaderGroupCellLayout } from "../../+types";
import { useGridRoot } from "../context";
import { getTranslate } from "@1771technologies/lytenyte-shared";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";

export interface HeaderGroupCellProps {
  readonly cell: HeaderGroupCellLayout;
}

const HeaderGroupCellImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderGroupCellProps
>(function HeaderCell({ cell, children, ...props }, forwarded) {
  const ctx = useGridRoot().grid.state;

  const xPositions = ctx.xPositions.useValue();
  const height = ctx.headerGroupHeight.useValue();

  const x = xPositions[cell.colStart];
  const width = xPositions[cell.colEnd] - x;
  const transform = getTranslate(x, 0);

  return (
    <div
      {...props}
      ref={forwarded}
      style={{
        gridRow: "1 / 2",
        gridColumn: "1 / 2",
        width,
        height,
        transform,
        boxSizing: "border-box",
      }}
    >
      {children == undefined ? cell.id : children}
    </div>
  );
});

export const HeaderGroupCell = fastDeepMemo(HeaderGroupCellImpl);
