import { useMemo, type CSSProperties } from "react";
import {
  type LayoutHeaderCell,
  type LayoutHeaderFloating,
  type LayoutHeaderGroup,
} from "@1771technologies/lytenyte-shared";
import { sizeFromCoord } from "@1771technologies/js-utils";
import { useSuppressScrollFlashContext } from "../../../root/contexts/viewport/viewport-context.js";

export function useHeaderCellStyle(
  cell: LayoutHeaderCell | LayoutHeaderFloating | LayoutHeaderGroup,
  xPositions: Uint32Array,
) {
  const sync = useSuppressScrollFlashContext();

  const styles = useMemo(() => {
    const styles: CSSProperties = {
      position: "relative",
      overflow: "hidden",
      gridColumnStart: `${cell.colStart + 1}`,
    };

    if (cell.colPin === "start") {
      styles.position = "sticky";
      styles.insetInlineStart = `${xPositions[cell.colStart]}px`;
      styles.gridColumnStart = `${cell.colStart + 1}`;
      styles.zIndex = 11;
    } else if (cell.colPin === "end") {
      styles.position = "sticky";
      const x =
        xPositions.at(-1)! -
        sizeFromCoord(cell.colStart, xPositions, cell.colSpan) -
        xPositions[cell.colStart];
      styles.gridColumnStart = `${cell.colStart + 2}`;
      styles.insetInlineEnd = `${x}px`;
      styles.zIndex = 11;
    } else {
      styles.gridColumnStart = `${cell.colStart + 1}`;
      if (sync) styles.transform = `var(--ln-x-transform)`;
    }

    return styles;
  }, [cell.colPin, cell.colSpan, cell.colStart, sync, xPositions]);

  return styles;
}
