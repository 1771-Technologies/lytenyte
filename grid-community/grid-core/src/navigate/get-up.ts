import {
  FLOATING_CELL_POSITION,
  FULL_WIDTH_POSITION,
  GRID_CELL_POSITION,
  HEADER_CELL_POSITION,
  HEADER_GROUP_CELL_POSITION,
} from "@1771technologies/grid-constants";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type {
  Position,
  PositionFloatingCell,
  PositionFullWidthRow,
  PositionGridCell,
  PositionHeaderCell,
  PositionHeaderGroupCell,
} from "@1771technologies/grid-types/core";
import { getGridCellPosition } from "./utils";

export const getUp = <D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>): Position | null => {
  const p = api.navigateGetPosition();
  if (!p) return null;

  if (p.kind === GRID_CELL_POSITION) return handleUpGridCell(api, p);
  if (p.kind === FULL_WIDTH_POSITION) return handleUpGridCell(api, p);
  if (p.kind === FLOATING_CELL_POSITION) return handleUpFloatingCell(p);
  if (p.kind === HEADER_CELL_POSITION) return handleUpHeaderCell(api, p);
  if (p.kind === HEADER_GROUP_CELL_POSITION) return handleUpHeaderGroupCell(api, p);

  return null;
};

function handleUpFloatingCell(p: PositionFloatingCell): Position | null {
  return {
    kind: HEADER_CELL_POSITION,
    columnIndex: p.columnIndex,
  };
}

function handleUpGridCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: PositionGridCell | PositionFullWidthRow,
): Position | null {
  const s = api.getState();

  if (p.rowIndex === 0) {
    if (s.floatingRowEnabled.peek())
      return { kind: FLOATING_CELL_POSITION, columnIndex: p.columnIndex };
    else return { kind: HEADER_CELL_POSITION, columnIndex: p.columnIndex };
  }

  let oneRowUp =
    p.kind === GRID_CELL_POSITION ? (p.root?.rowIndex ?? p.rowIndex) - 1 : p.rowIndex - 1;

  const rowCount = s.internal.rowCount.peek();
  const topCount = s.internal.rowTopCount.peek();
  const rowBottomCount = s.internal.rowBottomCount.peek();
  const isFirstBot = rowCount - rowBottomCount === p.rowIndex;

  if (s.paginate.peek() && isFirstBot) {
    const [_, lastRow] = api.paginateRowStartAndEndForPage(s.paginateCurrentPage.peek());
    oneRowUp = lastRow - 1;
  } else if (s.paginate.peek() && oneRowUp >= topCount) {
    const [firstRow, _] = api.paginateRowStartAndEndForPage(s.paginateCurrentPage.peek());

    if (oneRowUp < firstRow) {
      oneRowUp = topCount - 1;
    }
  }

  return getGridCellPosition(api, oneRowUp, p.columnIndex);
}

function handleUpHeaderCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: PositionHeaderCell,
): Position | null {
  const allLevels = api.getState().columnGroupLevels.peek();

  if (!allLevels.length) return p;

  let i = allLevels.length - 1;
  while (allLevels[i][p.columnIndex] == null && i >= 0) i--;

  if (i < 0) return p;

  const item = allLevels[i][p.columnIndex]!;

  return {
    kind: HEADER_GROUP_CELL_POSITION,
    columnStartIndex: item.start,
    columnEndIndex: item.end,
    columnIndex: p.columnIndex,
    hierarchyRowIndex: i,
  };
}

function handleUpHeaderGroupCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: PositionHeaderGroupCell,
): Position | null {
  const allLevels = api.getState().columnGroupLevels.peek();
  if (p.hierarchyRowIndex === 0) return p;

  let i = p.hierarchyRowIndex - 1;
  while (allLevels[i][p.columnStartIndex] == null && i >= 0) i--;

  if (i < 0) return p;

  const item = allLevels[i][p.columnIndex]!;

  return {
    kind: HEADER_GROUP_CELL_POSITION,
    columnStartIndex: item.start,
    columnEndIndex: item.end,
    columnIndex: p.columnIndex,
    hierarchyRowIndex: i,
  };
}
