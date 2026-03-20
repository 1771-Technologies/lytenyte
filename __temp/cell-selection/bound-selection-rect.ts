import { clamp, type ColumnView } from "@1771technologies/lytenyte-shared";
import type { DataRect } from "../types";

export function boundSelectionRect(view: ColumnView, rowCount: number, rect: DataRect): DataRect {
  const maxRow = rowCount;
  const minRow = 0;

  const maxColumn = view.visibleColumns.length;
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
