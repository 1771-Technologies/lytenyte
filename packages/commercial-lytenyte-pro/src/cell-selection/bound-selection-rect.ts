import { clamp } from "@1771technologies/lytenyte-js-utils";
import type { DataRect, Grid } from "../+types";

export function boundSelectionRect(grid: Grid<any>, rect: DataRect): DataRect {
  const rowCount = grid.state.rowDataStore.rowCount.get();

  const maxRow = rowCount;
  const minRow = 0;

  const maxColumn = grid.state.columnMeta.get().columnsVisible.length;
  const minColumn = 0;

  const rowStartMaybe = clamp(minRow, rect.rowStart, maxRow);
  const rowEndMaybe = clamp(minRow, rect.rowEnd, maxRow);
  const colStartMaybe = clamp(minColumn, rect.columnStart, maxColumn);
  const colEndMaybe = clamp(minColumn, rect.columnEnd, maxColumn);

  const rowStart = Math.min(rowStartMaybe, rowEndMaybe);
  const rowEnd = Math.max(rowStartMaybe, rowEndMaybe);
  const columnStart = Math.min(colStartMaybe, colEndMaybe);
  const columnEnd = Math.max(colStartMaybe, colEndMaybe);

  return { rowStart, rowEnd, columnStart, columnEnd };
}
