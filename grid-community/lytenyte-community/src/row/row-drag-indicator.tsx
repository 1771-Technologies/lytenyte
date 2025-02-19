import "./row-drag-indicator.css";

import { useGrid } from "../use-grid";
import { getTransform } from "../get-transform";
import { sizeFromCoord } from "@1771technologies/js-utils";

export interface DragIndicatorProps {
  readonly section: "top" | "bottom" | "center";
}

export function RowDragIndicator({ section }: DragIndicatorProps) {
  const { state } = useGrid();

  const rowIndex = state.internal.rowDragOverIndex.use();
  const dragIndex = state.internal.rowDragStartIndex.use();
  const yPositions = state.internal.rowPositions.use();

  const width = state.internal.viewportInnerWidth.use();

  const topCount = state.internal.rowTopCount.use();
  const bottomCount = state.internal.rowBottomCount.use();
  const rowCount = state.internal.rowCount.use();

  const isBefore = rowIndex < dragIndex;

  if (rowIndex === -1 || rowIndex == null) return null;
  if (section === "top" && rowIndex > topCount) return null;
  if ((section === "center" && rowIndex < topCount) || rowIndex >= rowCount - bottomCount)
    return null;
  if (section === "bottom" && rowIndex < rowCount - bottomCount) return null;

  const firstBotIndex = rowCount - bottomCount;
  const height = sizeFromCoord(rowIndex, yPositions);
  const y =
    section === "bottom"
      ? yPositions[rowIndex] - yPositions[firstBotIndex]
      : section === "top"
        ? yPositions[rowIndex]
        : yPositions[rowIndex] - yPositions[topCount];

  return (
    <div
      style={{ transform: getTransform(0, y + (isBefore ? 0 : height)), width }}
      className="lng1771-row-drag-indicator"
    />
  );
}
