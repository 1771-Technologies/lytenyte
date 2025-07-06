import { sizeFromCoord } from "../utils/size-from-coord";

interface ScrollRowIntoViewArgs {
  readonly topCount: number;
  readonly bottomCount: number;
  readonly rowCount: number;
  readonly rowIndex: number;
  readonly rowPositions: Uint32Array;

  readonly viewport: HTMLElement;

  readonly headerHeight: number;
}

export function rowScrollIntoViewValue({
  topCount,
  bottomCount,
  rowCount,
  rowIndex: r,
  rowPositions,
  viewport,
  headerHeight,
}: ScrollRowIntoViewArgs) {
  // Top and bottom rows are already always in view.
  if (r < topCount || r >= rowCount - bottomCount) return;

  const topHeight = rowPositions[topCount];
  const botHeight = sizeFromCoord(rowCount - bottomCount, rowPositions, bottomCount);
  const scrollY = viewport.scrollTop;

  const visibleStart = scrollY + topHeight + headerHeight;
  const visibleEnd = visibleStart + (viewport.clientHeight - topHeight - headerHeight - botHeight);

  const rowHeight = sizeFromCoord(r, rowPositions);
  const position = rowPositions[r];
  const visiblePosition = position + headerHeight;

  // Already visible
  if (visiblePosition > visibleStart && visiblePosition + rowHeight < visibleEnd) return;

  // The row is above the current view, so we are scrolling it to the top of the view
  if (visiblePosition <= visibleStart) {
    return position - topHeight;
  } else {
    return position - (viewport.clientHeight - headerHeight - botHeight) + rowHeight;
  }
}
