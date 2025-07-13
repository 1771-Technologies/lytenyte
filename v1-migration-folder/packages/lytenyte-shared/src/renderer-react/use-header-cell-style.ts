import { useMemo, type CSSProperties } from "react";
import type { CellHeader } from "./+types.renderer-react";
import { getTranslate } from "../utils/get-translate";

export function useHeaderCellStyle(
  cell: CellHeader,
  xPositions: Uint32Array,
  rtl: boolean,
  viewport: number,
) {
  const isSticky = !!cell.colPin;

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

  return styles;
}
