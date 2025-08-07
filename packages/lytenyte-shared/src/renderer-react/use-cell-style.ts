import { useMemo, type CSSProperties } from "react";
import type { Cell } from "./+types.renderer-react.js";
import { sizeFromCoord } from "../utils/size-from-coord.js";
import { getTranslate } from "../utils/get-translate.js";

export function useCellStyle(
  xPositions: Uint32Array,
  yPositions: Uint32Array,
  cell: Cell,
  rtl: boolean,
  detailHeight: number,
  viewportWidth: number,
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
      gridColumnStart: "1",
      gridColumnEnd: "2",
      gridRowStart: "1",
      gridRowEnd: "2",
      pointerEvents: "all",
    };
    if (isSticky) {
      styles.position = "sticky";

      if (rtl) styles.right = 0;
      else styles.left = 0;

      styles.zIndex = isRowPinned ? 5 : 2;
    }

    if (cell.colPin === "end") {
      const spaceLeft = xPositions.at(-1)! - xPositions[cell.colIndex];
      const x = viewportWidth - spaceLeft;
      styles.transform = getTranslate(rtl ? -x : x, 0);
    } else {
      const x = xPositions[cell.colIndex];
      styles.transform = getTranslate(rtl ? -x : x, 0);
    }

    return { ...additional, ...styles };
  }, [
    additional,
    cell.colIndex,
    cell.colPin,
    height,
    isRowPinned,
    isSticky,
    rtl,
    viewportWidth,
    width,
    xPositions,
  ]);

  return styles;
}
