import { forwardRef, useMemo, type CSSProperties, type JSX } from "react";
import type { HeaderCellLayout } from "../../+types";
import { useGridRoot } from "../context";
import { getTranslate, sizeFromCoord } from "@1771technologies/lytenyte-shared";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";

export interface HeaderCellProps {
  readonly cell: HeaderCellLayout;
}

const HeaderCellImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & HeaderCellProps>(
  function HeaderCell({ cell, children, ...props }, forwarded) {
    const ctx = useGridRoot().grid.state;

    const xPositions = ctx.xPositions.useValue();

    const width = sizeFromCoord(cell.colStart, xPositions, cell.colSpan);
    const rowSpan = cell.rowEnd - cell.rowStart;

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
        {children == undefined ? cell.column.id : children}
      </div>
    );
  },
);

export const HeaderCell = fastDeepMemo(HeaderCellImpl);
