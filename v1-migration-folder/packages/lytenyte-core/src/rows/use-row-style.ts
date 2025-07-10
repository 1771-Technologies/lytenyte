import { useMemo, type CSSProperties } from "react";
import { SCROLL_WIDTH_VARIABLE_USE, VIEWPORT_WIDTH_VARIABLE_USE } from "../+constants";
import type { RowFullWidthRowLayout, RowNormalRowLayout } from "../+types";
import { useGridRoot } from "../context";

export function useRowStyle(
  row: RowNormalRowLayout<any> | RowFullWidthRowLayout<any>,
  propStyles: CSSProperties | undefined,
  additional?: CSSProperties | undefined,
) {
  const cx = useGridRoot().grid;

  const yPositions = cx.state.yPositions.useValue();

  const height = yPositions[row.rowIndex + 1] - yPositions[row.rowIndex];

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
      visibility: row.rowIsFocusRow ? "hidden" : undefined,
    };

    return { ...propStyles, ...styles, ...additional };
  }, [additional, height, propStyles, row.rowIsFocusRow]);

  return styles;
}
