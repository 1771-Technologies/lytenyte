import { useMemo, type CSSProperties } from "react";
import { sizeFromCoord } from "../utils/size-from-coord.js";
import { SCROLL_WIDTH_VARIABLE_USE, VIEWPORT_WIDTH_VARIABLE_USE } from "../+constants.js";

export function useRowStyle(
  yPositions: Uint32Array,
  rowIndex: number,
  rowIsFocusRow: boolean,
  propStyles: CSSProperties | undefined,
  overrideStyles: CSSProperties | undefined,
): CSSProperties {
  const height = sizeFromCoord(rowIndex, yPositions);

  const styles = useMemo(() => {
    const styles: CSSProperties = {
      boxSizing: "border-box",
      height,
      width: SCROLL_WIDTH_VARIABLE_USE,
      minWidth: VIEWPORT_WIDTH_VARIABLE_USE,
      pointerEvents: "none",
      opacity: rowIsFocusRow ? "0" : undefined,
      whiteSpace: "nowrap",
      display: "flex",
    };

    return { ...propStyles, ...styles, ...overrideStyles };
  }, [height, overrideStyles, propStyles, rowIsFocusRow]);

  return styles;
}
