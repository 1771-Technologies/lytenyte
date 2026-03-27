import { useMemo, type CSSProperties } from "react";
import { sizeFromCoord, type LayoutCell } from "@1771technologies/lytenyte-shared";

export function useCellStyle(
  xPositions: Uint32Array,
  yPositions: Uint32Array,
  cell: LayoutCell,
  detailHeight: number,
): CSSProperties {
  const width = sizeFromCoord(cell.colIndex, xPositions, cell.colSpan);
  const height = sizeFromCoord(cell.rowIndex, yPositions, cell.rowSpan) - detailHeight;
  const isSticky = !!cell.colPin;
  const isRowPinned = !!cell.rowPin;

  const styles = useMemo(() => {
    const styles: CSSProperties = {
      height,
      width,
      minWidth: width,
      maxWidth: width,
      boxSizing: "border-box",
      pointerEvents: "all",
      overflow: "hidden",
    };
    if (cell.colPin === "end") {
      const x = xPositions.at(-1)! - xPositions[cell.colIndex + cell.colSpan];

      styles.position = "sticky";
      styles.insetInlineStart = `calc(100% - ${x + width}px)`;
      styles.zIndex = isRowPinned ? 5 : 2;
    } else if (isSticky) {
      const x = xPositions[cell.colIndex];

      styles.position = "sticky";
      styles.insetInlineStart = x;
      styles.zIndex = isRowPinned ? 5 : 2;
    } else {
      styles.position = "absolute";
      styles.insetInlineStart = `${xPositions[cell.colIndex]}px`;
    }

    return { ...styles };
  }, [cell.colIndex, cell.colPin, cell.colSpan, height, isRowPinned, isSticky, width, xPositions]);

  return styles;
}
