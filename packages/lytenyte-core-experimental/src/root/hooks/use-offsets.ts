import type { ColumnView, RowSource } from "@1771technologies/lytenyte-shared";

export function useOffsets(
  source: RowSource,
  view: ColumnView,
  totalHeaderHeight: number,
  xPositions: Uint32Array,
  yPositions: Uint32Array,
) {
  const topCount = source.useTopCount();
  const botCount = source.useBottomCount();
  const rowCount = source.useRowCount();

  const topOffset = yPositions[topCount] + totalHeaderHeight;
  const bottomOffset = yPositions.at(-1)! - yPositions[rowCount - botCount];

  const startOffset = xPositions[view.startCount];
  const endOffset = xPositions.at(-1)! - xPositions[view.centerCount + view.startCount];

  return { startOffset, topOffset, bottomOffset, endOffset };
}
