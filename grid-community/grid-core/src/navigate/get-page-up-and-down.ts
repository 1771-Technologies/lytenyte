import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import { getGridCellPosition, isGridCellPosition } from "./utils";
import type {
  PositionFullWidthRow,
  PositionGridCell,
} from "@1771technologies/grid-types/community";
import { getBottom, getTop } from "./get-top-and-bottom";

export function getPageDown<D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>) {
  const position = api.navigateGetPosition();

  if (!isGridCellPosition(position)) return position;

  const s = api.getState();

  const paginate = s.paginate.peek();

  if (paginate) return getBottom(api);

  const firstVisibleRow = s.internal.rowFirstVisible.peek();
  const lastVisibleRow = s.internal.rowLastVisible.peek();
  if (lastVisibleRow <= 0) return position;

  const p = position as PositionGridCell | PositionFullWidthRow;

  const pageJump = lastVisibleRow - firstVisibleRow;

  const rowCount = s.internal.rowCount.peek();
  const row = Math.min(p.rowIndex + pageJump, rowCount - 1);

  return getGridCellPosition(api, row, p.columnIndex);
}

export function getPageUp<D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>) {
  const position = api.navigateGetPosition();
  if (!isGridCellPosition(position)) return position;

  const s = api.getState();

  if (s.paginate.peek()) return getTop(api);

  const firstVisibleRow = s.internal.rowFirstVisible.peek();
  const lastVisibleRow = s.internal.rowLastVisible.peek();
  if (lastVisibleRow <= 0) return position;

  const p = position as PositionGridCell | PositionFullWidthRow;

  const pageJump = lastVisibleRow - firstVisibleRow;

  const row = Math.max(p.rowIndex - pageJump, 0);

  return getGridCellPosition(api, row, p.columnIndex);
}
