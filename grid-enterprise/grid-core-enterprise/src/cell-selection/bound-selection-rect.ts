import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { CellSelectionRect } from "@1771technologies/grid-types/enterprise";
import { clamp } from "@1771technologies/js-utils";

export function boundSelectionRect<D, E>(
  api: ApiEnterprise<D, E>,
  rect: CellSelectionRect,
): CellSelectionRect {
  const s = api.getState();
  const rowCount = s.internal.rowCount.peek();

  const maxRow = rowCount;
  const minRow = 0;

  const maxColumn = s.columnsVisible.peek().length;
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
