import { useMemo, type CSSProperties } from "react";
import { sizeFromCoord } from "../utils/size-from-coord.js";
import { SCROLL_WIDTH_VARIABLE_USE, VIEWPORT_WIDTH_VARIABLE_USE } from "../+constants.js";
import type { RowPin } from "../+types.js";
import { getTranslate } from "../utils/get-translate.js";

export function useRowStyle(
  yPositions: Uint32Array,
  rowIndex: number,
  rowPin: RowPin,
  topOffset: number,
  rowIsFocusRow: boolean,
  hasSpans: boolean,
  propStyles: CSSProperties | undefined,
  overrideStyles: CSSProperties | undefined,
): CSSProperties {
  const height = sizeFromCoord(rowIndex, yPositions);

  const styles = useMemo(() => {
    const isTranslated = rowPin == null;

    const styles: CSSProperties = {
      boxSizing: "border-box",
      height: isTranslated ? 0 : height,
      width: SCROLL_WIDTH_VARIABLE_USE,
      minWidth: VIEWPORT_WIDTH_VARIABLE_USE,
      pointerEvents: "none",
      opacity: rowIsFocusRow ? "0" : undefined,
      whiteSpace: "nowrap",
      display: "flex",
      flexWrap: "wrap",
      transform:
        isTranslated && !hasSpans ? getTranslate(0, yPositions[rowIndex] - topOffset) : undefined,
      position: isTranslated && hasSpans ? "relative" : undefined,
      top: isTranslated && hasSpans ? yPositions[rowIndex] - topOffset : undefined,
    };

    return { ...propStyles, ...styles, ...overrideStyles };
  }, [
    hasSpans,
    height,
    overrideStyles,
    propStyles,
    rowIndex,
    rowIsFocusRow,
    rowPin,
    topOffset,
    yPositions,
  ]);

  return styles;
}
