import { useMemo, type CSSProperties } from "react";
import type { RowPin } from "../+types.js";
import { isFirefox } from "@1771technologies/lytenyte-dom-utils";
import {
  getTranslate,
  SCROLL_WIDTH_VARIABLE_USE,
  sizeFromCoord,
  VIEWPORT_WIDTH_VARIABLE_USE,
} from "@1771technologies/lytenyte-shared";

const isFF = typeof window === "undefined" ? false : isFirefox();

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

    // FireFox does not correctly paint translations when scrolling. This results pin columns
    // appearing and disappearing as the user horizontally scrolls. However, if we directly
    // position the rows, then it appears to produce the correct calculation.
    // TODO @Lee: is there a reason to prefer transform over top? It seems like performance wise
    // they are the same, and we don't actually change the translation. It also seems using positioning
    // results in fewer cross browsers issues.
    const shouldBeRelative = isTranslated && (isFF || hasSpans);
    const isTranslatedButNotRelative = isTranslated && !hasSpans && !isFF;

    const styles: CSSProperties = {
      boxSizing: "border-box",
      height: isTranslated ? 0 : height,
      width: SCROLL_WIDTH_VARIABLE_USE,
      minWidth: VIEWPORT_WIDTH_VARIABLE_USE,
      pointerEvents: "none",
      opacity: rowIsFocusRow ? "0" : undefined,
      whiteSpace: "nowrap",
      display: "flex",
      transform: isTranslatedButNotRelative
        ? getTranslate(0, yPositions[rowIndex] - topOffset)
        : undefined,
      position: shouldBeRelative ? "relative" : undefined,
      top: shouldBeRelative ? yPositions[rowIndex] - topOffset : undefined,
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
