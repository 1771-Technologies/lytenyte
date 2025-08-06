import { useMemo, type CSSProperties } from "react";
import { sizeFromCoord } from "../utils/size-from-coord";
import { SCROLL_WIDTH_VARIABLE_USE, VIEWPORT_WIDTH_VARIABLE_USE } from "../+constants";

export function useRowStyle(
  yPositions: Uint32Array,
  rowIndex: number,
  rowIsFocusRow: boolean,
  propStyles: CSSProperties | undefined,
  overrideStyles: CSSProperties | undefined,
) {
  const height = sizeFromCoord(rowIndex, yPositions);

  const styles = useMemo(() => {
    const styles: CSSProperties = {
      boxSizing: "border-box",
      height,
      width: SCROLL_WIDTH_VARIABLE_USE,
      minWidth: VIEWPORT_WIDTH_VARIABLE_USE,
      display: "grid",
      gridTemplateColumns: "100%",
      gridTemplateRows: `${height}px`,
      pointerEvents: "none",
      opacity: rowIsFocusRow ? "0" : undefined,
    };

    return { ...propStyles, ...styles, ...overrideStyles };
  }, [height, overrideStyles, propStyles, rowIsFocusRow]);

  return styles;
}
