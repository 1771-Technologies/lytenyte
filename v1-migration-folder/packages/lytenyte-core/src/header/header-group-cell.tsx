import { forwardRef, useMemo, type CSSProperties, type JSX } from "react";
import type { HeaderGroupCellLayout } from "../+types";
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

  const isSticky = !!cell.colPin;
  const viewport = ctx.viewportWidthInner.useValue();
  const rtl = ctx.rtl.useValue();

  const styles = useMemo(() => {
    const styles: CSSProperties = {};
    if (isSticky) {
      styles.position = "sticky";
      styles.left = 0;
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

  return (
    <div
      {...props}
      tabIndex={0}
      ref={forwarded}
      role="columnheader"
      // Data attributes start
      data-ln-header-group
      data-ln-header-id={cell.id}
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
        gridRow: "1 / 2",
        gridColumn: "1 / 2",
        width,
        height,
        boxSizing: "border-box",
      }}
    >
      {children == undefined ? cell.id : children}
    </div>
  );
});

export const HeaderGroupCell = fastDeepMemo(HeaderGroupCellImpl);
