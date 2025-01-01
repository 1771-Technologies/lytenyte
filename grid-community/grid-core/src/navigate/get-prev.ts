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

export const getPrev = <D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>): Position | null => {
  const p = api.navigateGetPosition();
  if (!p) return null;

  if (p.kind === GRID_CELL_POSITION) return handlePrevGridCell(api, p);
  if (p.kind === FULL_WIDTH_POSITION) return p;
  if (p.kind === HEADER_CELL_POSITION) return handlePrevHeaderCell(p);
  if (p.kind === FLOATING_CELL_POSITION) return handlePrevHeaderCell(p);
  if (p.kind === HEADER_GROUP_CELL_POSITION) return handlePrevHeaderGroupCell(api, p);

  return null;
};

function handlePrevGridCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: PositionGridCell,
): Position | null {
  const nextColumnIndex = p.root ? p.root.columnIndex - 1 : p.columnIndex - 1;

  if (nextColumnIndex < 0) return p;

  return getGridCellPosition(api, p.rowIndex, nextColumnIndex);
}

function handlePrevHeaderCell(p: PositionHeaderCell | PositionFloatingCell): Position | null {
  const c = p.columnIndex;
  if (c === 0) return p;

  return {
    kind: p.kind,
    columnIndex: c - 1,
  };
}

function handlePrevHeaderGroupCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  position: PositionHeaderGroupCell,
): Position | null {
  const hierarchy = api.getState().columnGroupLevels.peek();

  let c = position.columnStartIndex - 1;
  const level = hierarchy[position.hierarchyRowIndex];
  while (level[c] == null && c >= 0) c--;

  if (c < 0) return position;

  const item = level[c]!;
  return {
    columnStartIndex: item.start,
    columnEndIndex: item.end,
    columnIndex: c,
    hierarchyRowIndex: position.hierarchyRowIndex,
    kind: HEADER_GROUP_CELL_POSITION,
  };
}
