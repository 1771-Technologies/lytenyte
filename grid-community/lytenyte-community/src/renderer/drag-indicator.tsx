import { t } from "@1771technologies/grid-design";
import { useGrid } from "../use-grid";
import { getTransform } from "./get-transform";
import { sizeFromCoord } from "@1771technologies/js-utils";

export interface DragIndicatorProps {
  readonly section: "top" | "bottom" | "center";
}

export function DragIndicator({ section }: DragIndicatorProps) {
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
      className={css`
        height: 2px;
        position: sticky;
        inset-inline-start: 0px;
        grid-column-start: 1;
        grid-column-end: 2;
        background-color: ${t.colors.primary_50};
        z-index: 20;
      `}
    />
  );
}
