import {
  GRID_CELL_POSITION,
  FULL_WIDTH_POSITION,
  FLOATING_CELL_POSITION,
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
} from "@1771technologies/grid-types/community";
import { getGridCellPosition, isLastRow, isPastLastPaginatedRow } from "./utils";

export const getDown = <D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>): Position | null => {
  const p = api.navigateGetPosition();
  if (!p) return null;

  if (p.kind === GRID_CELL_POSITION) return handleDownGridCell(api, p);
  if (p.kind === FULL_WIDTH_POSITION) return handleDownGridCell(api, p);
  if (p.kind === FLOATING_CELL_POSITION) return handleDownFloatingCell(api, p);
  if (p.kind === HEADER_CELL_POSITION) return handleDownHeaderCell(api, p);
  if (p.kind === HEADER_GROUP_CELL_POSITION) return handleDownHeaderGroupCell(api, p);

  return null;
};

function handleDownGridCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: PositionGridCell | PositionFullWidthRow,
): Position | null {
  if (isLastRow(api, p.rowIndex)) return p;

  const s = api.getState();

  let referenceIndex;
  if (p.kind === GRID_CELL_POSITION && p.root) {
    referenceIndex = p.root.rowIndex + p.root.rowSpan;
  } else {
    referenceIndex = p.rowIndex + 1;
  }

  const botCount = s.internal.rowBottomCount.peek();
  const firstBotIndex = s.internal.rowCount.peek() - botCount;
  const topCount = s.internal.rowTopCount.peek();

  if (referenceIndex < firstBotIndex && isPastLastPaginatedRow(api, referenceIndex)) {
    if (botCount === 0) return p;
    referenceIndex = firstBotIndex;
  } else if (p.rowIndex === topCount - 1) {
    const [start] = api.paginateRowStartAndEndForPage(s.paginateCurrentPage.peek());

    referenceIndex = start;
  }

  return getGridCellPosition(api, referenceIndex, p.columnIndex);
}

function handleDownFloatingCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: PositionFloatingCell,
) {
  const s = api.getState();
  if (s.internal.rowCount.peek() === 0) return p;

  return getGridCellPosition(api, 0, p.columnIndex);
}

function handleDownHeaderCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: PositionHeaderCell,
): Position | null {
  const s = api.getState();

  if (s.floatingRowEnabled.peek()) {
    return { kind: FLOATING_CELL_POSITION, columnIndex: p.columnIndex };
  }

  return getGridCellPosition(api, 0, p.columnIndex);
}

function handleDownHeaderGroupCell<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: PositionHeaderGroupCell,
): Position | null {
  const s = api.getState();

  const start = p.columnStartIndex;
  let level = p.hierarchyRowIndex + 1;

  const allLevels = s.columnGroupLevels.peek();

  const cnt = allLevels.length;

  while (level < cnt && allLevels[level][start] == null) {
    level++;
  }

  if (level >= cnt) return { kind: HEADER_CELL_POSITION, columnIndex: p.columnIndex };

  const item = allLevels[level][start]!;

  return {
    kind: HEADER_GROUP_CELL_POSITION,
    columnIndex: p.columnIndex,
    columnStartIndex: item.start,
    columnEndIndex: item.end,
    hierarchyRowIndex: level,
  };
}
