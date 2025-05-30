import type { ApiCore, PositionCore } from "@1771technologies/grid-types/core";
import { isGridCellPosition, getGridCellPosition } from "./utils";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export function getBottom<D, E>(api: ApiCore<D, E> | ApiPro<D, E>): PositionCore | null {
  const p = api.navigateGetPosition();
  if (!isGridCellPosition(p)) return p;

  const s = api.getState();
  const rowCount = s.internal.rowCount.peek();

  let lastRow = rowCount - 1;
  if (lastRow < 0) return null;

  const paginate = s.paginate.peek();
  const bottomCount = s.internal.rowBottomCount.peek();

  if (paginate && bottomCount === 0) {
    const [_, last] = api.paginateRowStartAndEndForPage(s.paginateCurrentPage.peek());
    lastRow = last - 1;
  }

  return getGridCellPosition(api, lastRow, p!.columnIndex);
}

export function getTop<D, E>(api: ApiCore<D, E> | ApiPro<D, E>): PositionCore | null {
  const p = api.navigateGetPosition();
  if (!isGridCellPosition(p)) return p;

  const s = api.getState();
  if (s.paginate.peek() && s.internal.rowTopCount.peek() === 0) {
    const [first] = api.paginateRowStartAndEndForPage(s.paginateCurrentPage.peek());

    return getGridCellPosition(api, first, p!.columnIndex);
  }

  return getGridCellPosition(api, 0, p!.columnIndex);
}
