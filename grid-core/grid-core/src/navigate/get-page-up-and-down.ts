import { getGridCellPosition, isGridCellPosition } from "./utils";
import { getBottom, getTop } from "./get-top-and-bottom";
import type {
  ApiCore,
  PositionCore,
  PositionFullWidthRowCore,
  PositionGridCellCore,
} from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export function getPageDown<D, E>(api: ApiCore<D, E> | ApiPro<D, E>): PositionCore | null {
  const position = api.navigateGetPosition();

  if (!isGridCellPosition(position)) return position;

  const s = api.getState();

  const paginate = s.paginate.peek();

  if (paginate) return getBottom(api);

  const { rowStart, rowEnd } = s.internal.virtBounds.peek();
  if (rowEnd <= 0) return position;

  const p = position as PositionGridCellCore | PositionFullWidthRowCore;

  const pageJump = rowEnd - rowStart;

  const rowCount = s.internal.rowCount.peek();
  const row = Math.min(p.rowIndex + pageJump, rowCount - 1);

  return getGridCellPosition(api, row, p.columnIndex);
}

export function getPageUp<D, E>(api: ApiCore<D, E> | ApiPro<D, E>): PositionCore | null {
  const position = api.navigateGetPosition();
  if (!isGridCellPosition(position)) return position;

  const s = api.getState();

  if (s.paginate.peek()) return getTop(api);

  const { rowStart, rowEnd } = s.internal.virtBounds.peek();
  if (rowEnd <= 0) return position;

  const p = position as PositionGridCellCore | PositionFullWidthRowCore;

  const pageJump = rowEnd - rowStart;

  const row = Math.max(p.rowIndex - pageJump, 0);

  return getGridCellPosition(api, row, p.columnIndex);
}
