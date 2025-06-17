import { forwardRef, type JSX } from "react";
import type { HeaderCellLayout } from "../../+types";
import { useGridRoot } from "../context";
import { getTranslate } from "@1771technologies/lytenyte-shared";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";

export interface HeaderCellProps {
  readonly cell: HeaderCellLayout;
}

const HeaderCellImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & HeaderCellProps>(
  function HeaderCell({ cell, children, ...props }, forwarded) {
    const ctx = useGridRoot().grid.state;

    const xPositions = ctx.xPositions.useValue();

    const x = xPositions[cell.colStart];
    const width = xPositions[cell.colEnd] - x;
    const transform = getTranslate(x, 0);

    const rowSpan = cell.rowEnd - cell.rowStart;

    return (
      <div
        {...props}
        ref={forwarded}
        style={{
          gridRowStart: 1,
          gridRowEnd: rowSpan + 1,
          gridColumn: "1 / 2",
          width,
          height: "100%",
          transform,
          boxSizing: "border-box",
        }}
      >
        {children == undefined ? cell.column.id : children}
      </div>
    );
  },
);

export const HeaderCell = fastDeepMemo(HeaderCellImpl);
