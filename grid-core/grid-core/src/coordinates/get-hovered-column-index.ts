import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";
import { getRelativeXPosition, rangedBinarySearch } from "@1771technologies/js-utils";

export function getHoveredColumnIndex(api: ApiPro<any, any> | ApiCore<any, any>, clientX: number) {
  const sx = api.getState();
  const viewport = sx.internal.viewport.peek();
  if (!viewport) return null;

  const visibleStartCount = sx.columnVisibleStartCount.peek();
  const visibleEndCount = sx.columnVisibleEndCount.peek();
  const visibleCenterCount = sx.columnVisibleCenterCount.peek();

  const xPositions = sx.columnPositions.peek();

  const startWidth = xPositions[visibleStartCount];
  const endWidth = xPositions.at(-1)! - xPositions.at(-visibleEndCount - 1)!;

  const coords = getRelativeXPosition(viewport, clientX);
  const visualX = sx.rtl.peek() ? coords.right : coords.left;
  const viewportWidth = sx.internal.viewportInnerWidth.peek();

  let x = -1;
  if (visualX > 0 && visualX < viewportWidth) {
    if (visualX < startWidth) {
      x = visualX;
    } else if (visualX > viewportWidth - endWidth) {
      x = visualX - (viewportWidth - endWidth) + xPositions[visibleStartCount + visibleCenterCount];
    } else {
      x = visualX + Math.abs(viewport.scrollLeft);
      const maxX = xPositions.at(-visibleEndCount - 1)!;
      if (x > maxX) x = -1;
    }
  }

  return x >= 0 ? rangedBinarySearch(xPositions, x) : null;
}
