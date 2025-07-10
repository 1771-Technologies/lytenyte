import { forwardRef, useMemo, type CSSProperties, type JSX } from "react";
import type { HeaderCellFloating, HeaderCellLayout } from "../+types";
import { useGridRoot } from "../context";
import { getTranslate, sizeFromCoord } from "@1771technologies/lytenyte-shared";
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

  const width = sizeFromCoord(cell.colStart, xPositions, cell.colSpan);
  const rowSpan = cell.rowEnd - cell.rowStart;

  const isSticky = !!cell.colPin;
  const viewport = ctx.viewportWidthInner.useValue();
  const rtl = ctx.rtl.useValue();

  const styles = useMemo(() => {
    const styles: CSSProperties = {};
    if (isSticky) {
      styles.position = "sticky";

      if (rtl) styles.right = 0;
      else styles.left = 0;

      styles.zIndex = 11;
    }

    if (cell.colPin === "end") {
      const spaceLeft = xPositions.at(-1)! - xPositions[cell.colStart];

      const x = viewport - spaceLeft;
      styles.transform = getTranslate(rtl ? -x : x, 0);
    } else {
      const x = xPositions[cell.colStart];
      styles.transform = getTranslate(rtl ? -x : x, 0);
    }
    return styles;
  }, [cell.colPin, cell.colStart, isSticky, rtl, viewport, xPositions]);

  const Renderer = useHeaderCellRenderer(cell);

  return (
    <div
      {...props}
      tabIndex={0}
      ref={forwarded}
      role="columnheader"
      // DATA Attributes Start
      data-ln-header-cell
      data-ln-header-floating={cell.kind === "floating" ? "true" : undefined}
      data-ln-header-id={cell.column.id}
      data-ln-header-range={`${cell.colStart},${cell.colStart + cell.colSpan}`}
      data-ln-rowindex={cell.rowStart}
      data-ln-colindex={cell.colStart}
      data-ln-header-pin={cell.colPin ?? "center"}
      data-ln-last-start-pin={cell.colLastStartPin}
      data-ln-first-end-pin={cell.colFirstEndPin}
      // Data attributes end
      style={{
        ...props.style,
        ...styles,
        gridRowStart: 1,
        gridRowEnd: rowSpan + 1,
        gridColumn: "1 / 2",
        width,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {children == undefined ? <Renderer column={cell.column} grid={grid} /> : children}
    </div>
  );
});

export const HeaderCell = fastDeepMemo(HeaderCellImpl);
