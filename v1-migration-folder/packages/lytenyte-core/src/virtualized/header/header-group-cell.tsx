import { forwardRef, useMemo, type CSSProperties, type JSX } from "react";
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

  const isSticky = !!cell.colPin;
  const viewport = ctx.viewportWidthInner.useValue();

  const styles = useMemo(() => {
    const styles: CSSProperties = {};
    if (isSticky) {
      styles.position = "sticky";
      styles.left = 0;
      styles.zIndex = 11;
    }

    if (cell.colPin === "end") {
      const spaceLeft = xPositions.at(-1)! - xPositions[cell.colStart];
      styles.transform = getTranslate(viewport - spaceLeft, 0);
    } else {
      styles.transform = getTranslate(xPositions[cell.colStart], 0);
    }

    return styles;
  }, [cell.colPin, cell.colStart, isSticky, viewport, xPositions]);

  return (
    <div
      {...props}
      ref={forwarded}
      role="columnheader"
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
