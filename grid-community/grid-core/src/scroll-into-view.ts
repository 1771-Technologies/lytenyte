import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";
import { sizeFromCoord } from "@1771technologies/js-utils";

export function columnScrollIntoViewValue<D, E>(api: ApiCore<D, E> | ApiPro<D, E>, c: number) {
  const s = api.getState();

  const startCount = s.columnVisibleStartCount.peek();
  const centerCount = s.columnVisibleCenterCount.peek();
  const endCount = s.columnVisibleEndCount.peek();

  if (c < startCount || c >= startCount + centerCount) return;

  const viewport = s.internal.viewport.peek();
  if (!viewport) return;

  const columnPositions = s.columnPositions.peek();

  const startWidth = columnPositions[startCount];
  const endWidth = sizeFromCoord(startCount + centerCount, columnPositions, endCount);

  const scrollX = Math.abs(viewport.scrollLeft);

  const visibleStart = scrollX + startWidth;
  const visibleEnd = visibleStart + (viewport.clientWidth - startWidth - endWidth);

  const colWidth = sizeFromCoord(c, columnPositions);
  const position = columnPositions[c];

  if (position + colWidth > visibleStart && position < visibleEnd) return;

  if (position + colWidth <= visibleStart) {
    return position - startWidth;
  } else {
    return position - (viewport.clientWidth - endWidth) + colWidth;
  }
}

export function rowScrollIntoViewValue<D, E>(api: ApiCore<D, E> | ApiPro<D, E>, r: number) {
  const s = api.getState();

  const topCount = s.internal.rowTopCount.peek();
  const bottomCount = s.internal.rowBottomCount.peek();
  const rowCount = s.internal.rowCount.peek();

  // Top and bottom rows are already always in view.
  if (r < topCount || r >= rowCount - bottomCount) return;

  const viewport = s.internal.viewport.peek();
  if (!viewport) return;

  const rowPositions = s.internal.rowPositions.peek();

  const topHeight = rowPositions[topCount];
  const botHeight = sizeFromCoord(rowCount - bottomCount, rowPositions, bottomCount);
  const scrollY = viewport.scrollTop;

  const headerHeight = s.internal.viewportHeaderHeight.peek();
  const visibleStart = scrollY + topHeight + headerHeight;
  const visibleEnd = visibleStart + (viewport.clientHeight - topHeight - headerHeight - botHeight);

  const rowHeight = sizeFromCoord(r, rowPositions);
  const position = rowPositions[r];
  const visiblePosition = position + headerHeight;

  // Already visible
  if (visiblePosition + rowHeight > visibleStart && visiblePosition < visibleEnd) return;

  // The row is above the current view, so we are scrolling it to the top of the view
  if (visiblePosition + rowHeight <= visibleStart) {
    return position - topHeight;
  } else {
    return position - (viewport.clientHeight - headerHeight - botHeight) + rowHeight;
  }
}
