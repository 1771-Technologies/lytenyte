import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import { getRelativeYPosition, rangedBinarySearch } from "@1771technologies/js-utils";

export function getHoveredRowIndex(
  api: ApiEnterprise<any, any> | ApiCommunity<any, any>,
  clientY: number,
) {
  const sx = api.getState();

  const viewport = sx.internal.viewport.peek();

  if (!viewport) return null;

  const rowPositions = sx.internal.rowPositions.peek();
  const headerHeight = sx.internal.viewportHeaderHeight.peek();

  const rowCount = sx.internal.rowCount.peek();
  const bottomCount = sx.internal.rowBottomCount.peek();
  const topCount = sx.internal.rowTopCount.peek();

  const viewportInnerHeight = sx.internal.viewportInnerHeight.peek();

  const topHeight = rowPositions[topCount] + headerHeight;
  const bottomHeight = rowPositions.at(-1)! - rowPositions[rowCount - bottomCount];

  const visualY = getRelativeYPosition(viewport, clientY).top;
  const scrollY = viewport.scrollTop;
  const viewportHeight = viewportInnerHeight;

  let y = -1;
  // Start by checking that the clientY value is within the viewport value. This just ensures the
  // the the cursor is actually inside the grid.
  if (visualY > 0 && visualY < viewportHeight) {
    if (visualY > headerHeight && visualY < topHeight) {
      y = visualY - headerHeight;
    } else if (visualY > viewportHeight - bottomHeight) {
      y = visualY - (viewportHeight - bottomHeight) + rowPositions[rowCount - bottomCount];
    } else if (visualY >= topHeight && visualY <= viewportHeight - bottomHeight) {
      y = visualY - headerHeight + scrollY;

      if (y > rowPositions.at(-bottomCount - 1)!) y = -1;

      // We need specific handling for paginate rows. We can only hover over rows on the page.
      // Hence we have a top cap on the end row. The end row will be one past the end, so it would
      // be fine to check for greater than or equal.
      if (sx.paginate.peek()) {
        const [firstRow, endRow] = api.paginateRowStartAndEndForPage(
          sx.internal.paginatePageCount.peek(),
        );

        const offset = rowPositions[firstRow] - rowPositions[topCount];
        y += offset;

        const rowIndex = rangedBinarySearch(rowPositions, y);
        return rowIndex >= endRow ? null : rowIndex;
      }
    }
  }

  if (y < 0) return null;

  const rowIndex = y >= 0 ? rangedBinarySearch(rowPositions, y) : null;
  if (rowIndex == null) return null;

  const rowY = rowPositions[rowIndex];
  const row = api.rowByIndex(rowIndex);
  if (!row) return null;

  const detailHeight = api.rowDetailIsExpanded(row.id) ? api.rowDetailVisibleHeight(row.id) : 0;
  const rowAndDetailHeight = api.rowVisibleRowHeight(rowIndex);
  const rowHeight = rowAndDetailHeight - detailHeight;

  if (y > rowHeight + rowY) return null;

  return rowIndex;
}
