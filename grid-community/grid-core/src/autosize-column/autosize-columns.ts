import type { ApiCore, AutosizeOptionsCore } from "@1771technologies/grid-types/core";
import { autosizeCellDefault } from "./autosize-cell-default";
import { autosizeHeaderDefault } from "./autosize-header-default";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const autosizeColumns = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  c?: string[] | null,
  opts?: AutosizeOptionsCore,
) => {
  const s = api.getState();
  const columns = c
    ? c.map((id) => api.columnById(id)).filter((c) => !!c)
    : s.columnsVisible.peek();

  const base = s.columnBase.peek();
  const autosizeAll = !!c;
  const columnsThatCanBeResized = columns
    .filter((c) => api.columnIsResizable(c as any))
    .filter((c) => {
      if (!api.columnIsResizable(c as any)) return false;

      if (!autosizeAll) return true;

      return !(c.cellSkipOnAutosizeAll ?? base.cellSkipOnAutosizeAll ?? false);
    });

  if (columnsThatCanBeResized.length === 0) return null;

  const result: Record<string, number> = {};

  const { rowStart: rowFirstVisible, rowEnd: rowLastVisible } = s.internal.virtBounds.peek();
  const rowTopCount = s.internal.rowTopCount.peek();
  const rowCount = s.internal.rowCount.peek();
  const rowBottomCount = s.internal.rowBottomCount.peek();

  const rowStart = Math.max(rowFirstVisible, 0);
  const rowEnd = rowLastVisible === 0 ? Math.min(50, rowCount - rowBottomCount) : rowLastVisible;

  calculateWidths(rowStart, rowEnd);
  if (rowTopCount) calculateWidths(0, rowTopCount);
  if (rowBottomCount) calculateWidths(rowCount - rowBottomCount, rowCount);

  if (opts?.includeHeader) {
    for (let columnIndex = 0; columnIndex < columnsThatCanBeResized.length; columnIndex++) {
      const column = columnsThatCanBeResized[columnIndex];

      const autoFn = column.headerAutosizeFn ?? base.headerAutosizeFn ?? autosizeHeaderDefault;

      const width = autoFn({ api: api as any, column: column as any });

      result[column.id] = Math.max(width, result[column.id]);
    }
  }

  if (opts?.dryRun) return result;

  const updates = Object.fromEntries(
    Object.entries(result).map(([key, v]) => [key, { width: v }] as const),
  );

  api.columnUpdateMany(updates);

  return result;

  function calculateWidths(start: number, end: number) {
    for (let rowIndex = start; rowIndex < end; rowIndex++) {
      const row = api.rowByIndex(rowIndex);
      if (!row) continue;

      for (let i = 0; i < columnsThatCanBeResized.length; i++) {
        const column = columnsThatCanBeResized[i];

        const autoFn = column.cellAutosizeFn ?? base.cellAutosizeFn ?? autosizeCellDefault;
        const width = autoFn({ api: api as any, column: column as any, row });
        result[column.id] ??= 0;
        result[column.id] = Math.max(width, result[column.id]);
      }
    }
  }
};
