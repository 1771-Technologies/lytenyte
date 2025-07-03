import { sizeFromCoord } from "@1771technologies/js-utils";

interface ColumnScrollIntoViewValueArgs {
  readonly startCount: number;
  readonly centerCount: number;
  readonly endCount: number;

  readonly columnIndex: number;
  readonly columnPositions: Uint32Array;
  readonly viewport: HTMLElement;
}

export function columnScrollIntoViewValue({
  startCount,
  centerCount,
  endCount,
  columnIndex: c,
  columnPositions,
  viewport,
}: ColumnScrollIntoViewValueArgs) {
  if (c < startCount || c >= startCount + centerCount) return;

  const startWidth = columnPositions[startCount];
  const endWidth = sizeFromCoord(startCount + centerCount, columnPositions, endCount);

  const scrollX = Math.abs(viewport.scrollLeft);

  const visibleStart = scrollX + startWidth;
  const visibleEnd = visibleStart + (viewport.clientWidth - startWidth - endWidth);

  const colWidth = sizeFromCoord(c, columnPositions);
  const position = columnPositions[c];

  if (position > visibleStart && position + colWidth < visibleEnd) return;

  if (position + colWidth <= visibleStart) {
    return position - startWidth;
  } else {
    return position - (viewport.clientWidth - endWidth) + colWidth;
  }
}
