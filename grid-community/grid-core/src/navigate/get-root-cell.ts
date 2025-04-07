import type { ApiPro } from "@1771technologies/grid-types/pro";
import { isBottomRow, isEndColumn, isStartColumn, isTopRow } from "./utils";
import type { ApiCore, PositionGridCellCore } from "@1771technologies/grid-types/core";

export const getRootCell = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  rowIndex: number,
  columnIndex: number,
): PositionGridCellCore["root"] => {
  const s = api.getState();

  const columnsWithColSpan = s.columnsWithColSpan.peek();
  const columnsWithRowSpan = s.columnsWithRowSpan.peek();

  // If we are not using row or column spans, then the cell will definitely not be covered,
  // hence its root cell definitely be null. So we can just skip the remaining work
  if (columnsWithColSpan.size === 0 && columnsWithRowSpan.size === 0) return null;

  const startCount = s.columnVisibleStartCount.peek();
  const rowCount = s.internal.rowCount.peek();

  const firstBot = rowCount - s.internal.rowBottomCount.peek();
  const firstEnd = startCount + s.columnVisibleCenterCount.peek();

  const isTop = isTopRow(api, rowIndex);
  const isBot = isBottomRow(api, rowIndex);
  const isStart = isStartColumn(api, columnIndex);
  const isEnd = isEndColumn(api, columnIndex);

  const topCount = s.internal.rowTopCount.peek();
  const rowScan = s.rowSpanScanDistance.peek();
  const colScan = s.columnSpanScanDistance.peek();

  const rowStart = isTop ? 0 : isBot ? firstBot : Math.max(rowIndex - rowScan, topCount);
  const colStart = isStart ? 0 : isEnd ? firstEnd : Math.max(columnIndex - colScan, startCount);

  const maxRow = isTop ? topCount : isBot ? rowCount : firstBot;
  const maxCol = isStart ? startCount : isEnd ? s.columnsVisible.peek().length : firstEnd;

  const coveredCells: Record<
    number,
    Record<number, { columnIndex: number; rowIndex: number; rowSpan: number; columnSpan: number }>
  > = {};

  const isFullWidth = s.internal.rowIsFullWidthInternal.peek();
  const getRowSpan = s.columnGetRowSpan.peek();
  const getColSpan = s.columnGetColSpan.peek();

  for (let r = rowStart; r <= rowIndex; r++) {
    if (isFullWidth(r)) continue;

    const maxRowSpan = maxRow - r;

    for (let c = colStart; c <= columnIndex; c++) {
      if (coveredCells[r]?.[c]) continue;

      const maxColSpan = maxCol - c;

      const rowSpan = columnsWithRowSpan.has(c) ? Math.min(getRowSpan(r, c), maxRowSpan) : 1;
      const colSpan = columnsWithColSpan.has(c) ? Math.min(getColSpan(r, c), maxColSpan) : 1;

      if (rowSpan > 1 || colSpan > 1) {
        const entry = { columnIndex: c, rowIndex: r, rowSpan, columnSpan: colSpan };
        for (let i = r; i < r + rowSpan; i++) {
          for (let j = c; j < c + colSpan; j++) {
            coveredCells[i] ??= {};
            coveredCells[i][j] = entry;
          }
        }
      }
    }
  }

  return coveredCells[rowIndex]?.[columnIndex] ?? null;
};
