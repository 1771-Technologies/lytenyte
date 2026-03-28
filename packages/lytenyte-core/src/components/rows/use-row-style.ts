import { useMemo, type CSSProperties } from "react";
import { type RowPin } from "@1771technologies/lytenyte-shared";
import {
  SCROLL_WIDTH_VARIABLE_USE,
  sizeFromCoord,
  VIEWPORT_WIDTH_VARIABLE_USE,
} from "@1771technologies/lytenyte-shared";

export function useRowStyle(
  yPositions: Uint32Array,
  rowIndex: number,
  rowPin: RowPin,
  topOffset: number,
  rowIsFocusRow: boolean,
  detailHeight: number,
  propStyles: CSSProperties | undefined,
): CSSProperties {
  const height = sizeFromCoord(rowIndex, yPositions);

  const styles = useMemo(() => {
    const isTranslated = rowPin == null;

    // FireFox does not correctly paint translations when scrolling. This results pin columns
    // appearing and disappearing as the user horizontally scrolls. However, if we directly
    // position the rows, then it appears to produce the correct calculation.

    // @Lee: is there a reason to prefer transform over top? It seems like performance wise
    // they are the same, and we don't actually change the translation. It also seems using positioning
    // results in fewer cross browsers issues.

    const styles: CSSProperties = {
      boxSizing: "border-box",
      height: isTranslated ? 0 : height,
      width: SCROLL_WIDTH_VARIABLE_USE,
      minWidth: VIEWPORT_WIDTH_VARIABLE_USE,
      pointerEvents: "none",
      opacity: rowIsFocusRow ? "0" : undefined,
      whiteSpace: "nowrap",
      display: "flex",
      position: isTranslated ? "relative" : undefined,
      top: isTranslated ? yPositions[rowIndex] - topOffset : undefined,

      "--ln-row-height": `${height - detailHeight}px`,
    } as CSSProperties;

    return { ...propStyles, ...styles };
  }, [detailHeight, height, propStyles, rowIndex, rowIsFocusRow, rowPin, topOffset, yPositions]);

  return styles;
}
