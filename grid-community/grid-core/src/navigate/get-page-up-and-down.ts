import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import { getGridCellPosition, isGridCellPosition } from "./utils";
import type { PositionFullWidthRow, PositionGridCell } from "@1771technologies/grid-types/core";
import { getBottom, getTop } from "./get-top-and-bottom";

export function getPageDown<D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>) {
  const position = api.navigateGetPosition();

  if (!isGridCellPosition(position)) return position;

  const s = api.getState();

  const paginate = s.paginate.peek();

  if (paginate) return getBottom(api);

  const { rowStart, rowEnd } = s.internal.virtBounds.peek();
  if (rowEnd <= 0) return position;

  const p = position as PositionGridCell | PositionFullWidthRow;

  const pageJump = rowEnd - rowStart;

  const rowCount = s.internal.rowCount.peek();
  const row = Math.min(p.rowIndex + pageJump, rowCount - 1);

  return getGridCellPosition(api, row, p.columnIndex);
}

export function getPageUp<D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>) {
  const position = api.navigateGetPosition();
  if (!isGridCellPosition(position)) return position;

  const s = api.getState();

  if (s.paginate.peek()) return getTop(api);

  const { rowStart, rowEnd } = s.internal.virtBounds.peek();
  if (rowEnd <= 0) return position;

  const p = position as PositionGridCell | PositionFullWidthRow;

  const pageJump = rowEnd - rowStart;

  const row = Math.max(p.rowIndex - pageJump, 0);

  return getGridCellPosition(api, row, p.columnIndex);
}
