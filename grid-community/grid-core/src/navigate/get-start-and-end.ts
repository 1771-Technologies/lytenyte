import {
  FLOATING_CELL_POSITION,
  FULL_WIDTH_POSITION,
  GRID_CELL_POSITION,
  HEADER_CELL_POSITION,
  HEADER_GROUP_CELL_POSITION,
} from "@1771technologies/grid-constants";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { Position } from "@1771technologies/grid-types/core";
import { getGridCellPosition } from "./utils";

export function getEnd<D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>): Position | null {
  const p = api.navigateGetPosition();
  if (!p) return null;

  const s = api.getState();

  if (p.kind === HEADER_GROUP_CELL_POSITION) {
    const allLevels = s.columnGroupLevels.peek();
    const level = allLevels[p.hierarchyRowIndex];

    let c = level.length - 1;
    while (level[c] == null && c >= 0) c--;

    if (c < 0) return null;

    const item = level[c]!;

    return {
      kind: p.kind,
      columnStartIndex: item.start,
      columnEndIndex: item.end,
      columnIndex: item.start,
      hierarchyRowIndex: p.hierarchyRowIndex,
    };
  }

  const lastColumn = s.columnsVisible.peek().length - 1;

  if (p.kind === HEADER_CELL_POSITION || p.kind === FLOATING_CELL_POSITION)
    return { kind: p.kind, columnIndex: lastColumn };

  if (p.kind === FULL_WIDTH_POSITION) return p;
  if (p.kind === GRID_CELL_POSITION) return getGridCellPosition(api, p.rowIndex, lastColumn);

  return null;
}

export function getStart<D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>): Position | null {
  const p = api.navigateGetPosition();
  if (!p) return null;

  const s = api.getState();

  if (p.kind === HEADER_GROUP_CELL_POSITION) {
    const allLevels = s.columnGroupLevels.peek();
    const level = allLevels[p.hierarchyRowIndex];

    let c = 0;
    while (level[c] == null && c < level.length) c++;

    // This condition should not be possible in normal usage
    if (c >= level.length) return null;

    const item = level[c]!;

    return {
      kind: p.kind,
      columnStartIndex: item.start,
      columnEndIndex: item.end,
      columnIndex: item.start,
      hierarchyRowIndex: p.hierarchyRowIndex,
    };
  }

  if (p.kind === HEADER_CELL_POSITION || p.kind === FLOATING_CELL_POSITION)
    return { kind: p.kind, columnIndex: 0 };

  if (p.kind === FULL_WIDTH_POSITION) return p;

  if (p.kind === GRID_CELL_POSITION) return getGridCellPosition(api, p.rowIndex, 0);

  return null;
}
