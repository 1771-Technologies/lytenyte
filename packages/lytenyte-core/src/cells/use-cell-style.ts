import { useMemo, type CSSProperties } from "react";
import { sizeFromCoord } from "@1771technologies/lytenyte-shared";
import type { Cell } from "./+types.cell";

export function useCellStyle(
  xPositions: Uint32Array,
  yPositions: Uint32Array,
  cell: Cell,
  rtl: boolean,
  detailHeight: number,
  additional: CSSProperties | undefined,
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
      display: "inline-block",
      overflow: "hidden",
    };
    if (cell.colPin === "end") {
      styles.position = "sticky";
      const x = xPositions.at(-1)! - xPositions[cell.colIndex + cell.colSpan];

      if (rtl) styles.left = x;
      else styles.right = x;

      styles.zIndex = isRowPinned ? 5 : 2;
    } else if (isSticky) {
      styles.position = "sticky";

      const x = xPositions[cell.colIndex];

      if (rtl) styles.right = x;
      else styles.left = x;

      styles.zIndex = isRowPinned ? 5 : 2;
    }

    return { ...additional, ...styles };
  }, [
    additional,
    cell.colIndex,
    cell.colPin,
    cell.colSpan,
    height,
    isRowPinned,
    isSticky,
    rtl,
    width,
    xPositions,
  ]);

  return styles;
}
