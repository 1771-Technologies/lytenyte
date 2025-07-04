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

  const start = scrollX + startWidth;
  const end = start + (viewport.clientWidth - startWidth - endWidth);

  const colWidth = sizeFromCoord(c, columnPositions);
  const position = columnPositions[c];

  const posStart = position;
  const posEnd = posStart + colWidth;

  // We have some overlap so we move just enough for it to be in view
  if (posStart < start && posEnd > start) return position - colWidth;

  if (position + colWidth > start && position + colWidth < end) return;

  if (position + colWidth <= start) {
    return position - startWidth;
  } else {
    return position - (viewport.clientWidth - endWidth) + colWidth;
  }
}
