import type { Grid, PositionGridCell } from "../+types";
import { getSpanFn } from "../state/helpers/get-span-callback";
import { getFullWidthCallback } from "../state/helpers/get-full-width-callback";
import { applyLayoutUpdate, type LayoutMap } from "@1771technologies/lytenyte-shared";

export const getRootCell = (
  grid: Grid<any>,
  rowIndex: number,
  columnIndex: number,
): PositionGridCell["root"] => {
  const rds = grid.state.rowDataSource.get();

  const meta = grid.state.columnMeta.get();
  const columns = meta.columnsVisible;

  const rowScan = grid.state.rowScanDistance.get();
  const colScan = grid.state.colScanDistance.get();
  const fullWidth = grid.state.rowFullWidthPredicate.get().fn;

  const layoutMap: LayoutMap = new Map();

  const topCount = grid.state.rowDataStore.rowTopCount.get();
  const botCount = grid.state.rowDataStore.rowBottomCount.get();
  const rowCenterCount = grid.state.rowDataStore.rowCenterCount.get();

  const isTop = rowIndex < topCount;
  const isBot = rowIndex >= topCount + rowCenterCount;

  const isStart = columns[columnIndex].pin === "start";
  const isEnd = columns[columnIndex].pin === "end";

  applyLayoutUpdate({
    computeColSpan: getSpanFn(rds, grid, columns, "col"),
    computeRowSpan: getSpanFn(rds, grid, columns, "row"),
    colScanDistance: colScan,
    rowScanDistance: rowScan,
    invalidated: true,
    isFullWidth: getFullWidthCallback(rds, fullWidth, grid),
    isRowCutoff: (r) => {
      const row = rds.rowByIndex(r);
      return !row || row.kind === "branch";
    },
    layoutMap,
    nextLayout: {
      rowTopStart: 0,
      rowTopEnd: topCount,
      rowBotStart: topCount + rowCenterCount,
      rowBotEnd: topCount + rowCenterCount + botCount,
      rowCenterStart: isTop || isBot ? 0 : rowIndex,
      rowCenterEnd: isTop || isBot ? 0 : rowIndex + 1,
      rowCenterLast: topCount + rowCenterCount,

      colStartStart: 0,
      colStartEnd: meta.columnVisibleStartCount,
      colEndStart: meta.columnVisibleStartCount + meta.columnVisibleCenterCount,
      colEndEnd: columns.length,

      colCenterStart: isStart || isEnd ? 0 : columnIndex,
      colCenterEnd: isStart || isEnd ? 0 : columnIndex + 1,
      colCenterLast: meta.columnVisibleStartCount + meta.columnVisibleCenterCount,
    },
    prevLayout: {
      colCenterEnd: -1,
      colCenterLast: -1,
      colCenterStart: -1,
      colEndEnd: -1,
      colEndStart: -1,
      colStartEnd: -1,
      colStartStart: -1,
      rowBotEnd: -1,
      rowBotStart: -1,
      rowCenterEnd: -1,
      rowCenterLast: -1,
      rowCenterStart: -1,
      rowTopEnd: -1,
      rowTopStart: -1,
    },
  });

  const row = layoutMap.get(rowIndex);

  const cell = row?.get(columnIndex);

  if (!cell) return null;

  if (cell?.length === 2)
    return {
      colIndex: columnIndex,
      colSpan: 1,
      rowIndex: rowIndex,
      rowSpan: 1,
    };

  // Otherwise this is a spanning cell hence we need to find the spans layout.
  const root = layoutMap.get(cell[1]);
  const rootCell = root?.get(cell[2]);
  if (!rootCell) return null;

  return {
    colIndex: cell[2],
    rowIndex: cell[1],
    rowSpan: rootCell[0],
    colSpan: rootCell[1],
  };
};
