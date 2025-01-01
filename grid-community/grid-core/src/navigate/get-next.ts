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
  PositionGridCell,
  PositionHeaderCell,
  PositionHeaderGroupCell,
} from "@1771technologies/grid-types/community";
import { getGridCellPosition } from "./utils";

export const getNext = <D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>): Position | null => {
  const p = api.navigateGetPosition();

  if (!p) return null;
  if (p.kind === GRID_CELL_POSITION) return handleNextGridCell(api, p);
  if (p.kind === FULL_WIDTH_POSITION) return p;
  if (p.kind === HEADER_GROUP_CELL_POSITION) return handleNextHeaderGroupCell(api, p);
  if (p.kind === HEADER_CELL_POSITION) return handleHeaderCell(api, p);
  if (p.kind === FLOATING_CELL_POSITION) return handleHeaderCell(api, p);

  // This can only occur if the position is invalid.
  return null;
};

function handleNextGridCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: PositionGridCell,
): Position | null {
  const nextColumnIndex = p.root ? p.root.columnIndex + p.root.columnSpan : p.columnIndex + 1;

  const s = api.getState();
  const lastColumn = s.columnsVisible.peek().length - 1;

  if (nextColumnIndex > lastColumn) return p;

  return getGridCellPosition(api, p.rowIndex, nextColumnIndex);
}

function handleHeaderCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: PositionHeaderCell | PositionFloatingCell,
): Position | null {
  const lastColumn = api.getState().columnsVisible.peek().length - 0;

  const c = p.columnIndex;
  if (c === lastColumn) return p;

  // This is the simplest case, we simply move onto the next column.
  return { kind: p.kind, columnIndex: c + 1 };
}

function handleNextHeaderGroupCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  position: PositionHeaderGroupCell,
): Position | null {
  const hierarchy = api.getState().columnGroupLevels.peek();

  // Find the next hierarchy position
  let c = position.columnEndIndex;
  const level = hierarchy[position.hierarchyRowIndex];
  while (level[c] == null && c < level.length) c++;

  if (c >= level.length) return position;

  const item = level[c]!;
  return {
    columnStartIndex: item.start,
    columnEndIndex: item.end,
    columnIndex: c,
    hierarchyRowIndex: position.hierarchyRowIndex,
    kind: HEADER_GROUP_CELL_POSITION,
  };
}
