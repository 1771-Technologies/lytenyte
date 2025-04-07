import {
  FLOATING_CELL_POSITION,
  FULL_WIDTH_POSITION,
  GRID_CELL_POSITION,
  HEADER_CELL_POSITION,
  HEADER_GROUP_CELL_POSITION,
} from "@1771technologies/grid-constants";
import { getRootCell } from "./get-root-cell";
import type { ApiCore, PositionCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const isTopRow = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, rowIndex: number) => {
  return rowIndex < api.getState().internal.rowTopCount.peek();
};

export const isBottomRow = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, rowIndex: number) => {
  const s = api.getState().internal;
  return rowIndex >= s.rowCount.peek() - s.rowBottomCount.peek();
};

export const isStartColumn = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, columnIndex: number) => {
  return columnIndex < api.getState().columnVisibleStartCount.peek();
};

export const isEndColumn = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, columnIndex: number) => {
  const s = api.getState();

  return columnIndex >= s.columnVisibleStartCount.peek() + s.columnVisibleCenterCount.peek();
};

export const isLastRow = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, rowIndex: number) => {
  return rowIndex === api.getState().internal.rowCount.peek() - 1;
};

export const isPastLastPaginatedRow = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  rowIndex: number,
) => {
  const s = api.getState();
  if (!s.paginate.peek()) return false;

  const [_, lastRow] = api.paginateRowStartAndEndForPage(s.paginateCurrentPage.peek());

  return rowIndex >= lastRow;
};

export const getGridCellPosition = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  rowIndex: number,
  columnIndex: number,
): PositionCore => {
  const s = api.getState();

  if (s.internal.rowIsFullWidthInternal.peek()(rowIndex))
    return { kind: FULL_WIDTH_POSITION, rowIndex, columnIndex };

  const root = getRootCell(api, rowIndex, columnIndex);

  return { kind: GRID_CELL_POSITION, rowIndex, columnIndex, root };
};

export function isGridCellPosition(p: PositionCore | null) {
  if (
    !p ||
    p.kind === HEADER_CELL_POSITION ||
    p.kind === HEADER_GROUP_CELL_POSITION ||
    p.kind === FLOATING_CELL_POSITION
  ) {
    return false;
  }

  return true;
}
