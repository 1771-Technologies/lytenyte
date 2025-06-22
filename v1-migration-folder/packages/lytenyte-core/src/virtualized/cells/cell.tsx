import { forwardRef, useMemo, type CSSProperties, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowCellLayout } from "../../+types";
import { useGridRoot } from "../context";
import { getTranslate, sizeFromCoord } from "@1771technologies/lytenyte-shared";

export interface CellProps {
  readonly cell: RowCellLayout;
}

const CellImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & CellProps>(function Cell(
  { cell, ...props },
  forwarded,
) {
  const cx = useGridRoot().grid.state;
  const xPositions = cx.xPositions.useValue();
  const yPositions = cx.yPositions.useValue();

  const viewport = cx.viewportWidthInner.useValue();
  const width = sizeFromCoord(cell.colIndex, xPositions, cell.colSpan);
  const height = sizeFromCoord(cell.rowIndex, yPositions, cell.rowSpan);

  const isSticky = !!cell.colPin;
  const isRowPinned = !!cell.rowPin;

  const styles = useMemo(() => {
    const styles: CSSProperties = {
      height,
      width,
      minWidth: width,
      maxWidth: width,
      boxSizing: "border-box",
      gridColumnStart: "1",
      gridColumnEnd: "2",
      gridRowStart: "1",
      gridRowEnd: "2",
    };
    if (isSticky) {
      styles.position = "sticky";
      styles.left = 0;

      styles.zIndex = isRowPinned ? 5 : 2;
    }

    if (cell.colPin === "end") {
      const spaceLeft = xPositions.at(-1)! - xPositions[cell.colIndex];
      styles.transform = getTranslate(viewport - spaceLeft, 0);
    } else {
      styles.transform = getTranslate(xPositions[cell.colIndex], 0);
    }

    return { ...props.style, ...styles };
  }, [
    cell.colIndex,
    cell.colPin,
    height,
    isRowPinned,
    isSticky,
    props.style,
    viewport,
    width,
    xPositions,
  ]);

  return <div {...props} ref={forwarded} style={styles} />;
});

export const Cell = fastDeepMemo(CellImpl);
