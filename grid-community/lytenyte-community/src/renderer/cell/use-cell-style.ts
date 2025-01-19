import { useMemo, type CSSProperties } from "react";
import { getTransform } from "../get-transform";
import type { ColumnCommunityReact } from "@1771technologies/grid-types";
import { sizeFromCoord } from "@1771technologies/js-utils";

export function useCellStyle(
  xPositions: Uint32Array,
  yPositions: Uint32Array,
  columnIndex: number,
  rowIndex: number,
  columnSpan: number,
  rowSpan: number,
  column: ColumnCommunityReact<any>,
  viewportWidth: number,
) {
  const height = sizeFromCoord(rowIndex, yPositions, rowSpan);
  const width = sizeFromCoord(columnIndex, xPositions, columnSpan);

  const styles = useMemo(() => {
    const transform = getTransform(xPositions[columnIndex], yPositions[rowIndex]);
    const style = { height, width, transform } as CSSProperties;

    if (column.pin === "start") {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = 2;
    }
    if (column.pin === "end") {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = 2;

      const x = xPositions[columnIndex] - xPositions.at(-1)! + viewportWidth;

      style.transform = getTransform(x, yPositions[rowIndex]);
    }

    return style;
  }, [column.pin, columnIndex, height, rowIndex, viewportWidth, width, xPositions, yPositions]);

  return styles;
}
