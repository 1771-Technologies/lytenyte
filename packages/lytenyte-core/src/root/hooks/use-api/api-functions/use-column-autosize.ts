import type { ColumnAbstract, ColumnView, SpanLayout } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import { resolveColumn } from "../auxiliary-functions/resolve-column.js";
import { defaultAutosize, defaultAutosizeHeader } from "../auxiliary-functions/autosizers.js";

export function useColumnAutosize(
  props: Root.Props,
  api: Root.API,
  bounds: SpanLayout,
  view: ColumnView,
  rowCount: number,
  rowBottomCount: number,
  rowTopCount: number,
): Root.API["columnAutosize"] {
  return useEvent((params = {}) => {
    const errorRef = { current: false };

    const columns =
      (params.columns
        ?.map((c) => resolveColumn(c, errorRef, view))
        .map((c) => c && (typeof c === "string" ? api.columnById(c) : c))
        .filter(Boolean) as ColumnAbstract[]) ?? view.visibleColumns;

    if (errorRef.current) {
      console.error("Invalid column autosize column params");
      return {};
    }
    if (columns.length === 0) return {};

    const base = props.columnBase ?? {};
    const result: Record<string, number> = {};

    const rowFirstVisible = bounds.rowCenterStart;
    const rowLastVisible = bounds.rowCenterEnd;

    const rowStart = Math.max(rowFirstVisible, 0);
    const rowEnd = rowLastVisible === 0 ? Math.min(50, rowCount - rowBottomCount) : rowLastVisible;
    calculateWidths(rowStart, rowEnd);
    if (rowTopCount) calculateWidths(0, rowTopCount);
    if (rowBottomCount) calculateWidths(rowCount - rowBottomCount, rowCount);

    if (params?.includeHeader) {
      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const column = columns[columnIndex];

        const autoFn =
          (column as any).autosizeHeaderFn ?? (base as any).autosizeHeaderFn ?? defaultAutosizeHeader;

        const width = autoFn({ api, column: column as any });

        if (width != null) result[column.id] = Math.max(width, result[column.id]);
      }
    }

    if (params?.dryRun) return result;

    const updates = Object.fromEntries(
      Object.entries(result).map(([key, v]) => [key, { width: v }] as const),
    );

    api.columnUpdate(updates);

    return result;

    function calculateWidths(start: number, end: number) {
      for (let rowIndex = start; rowIndex < end; rowIndex++) {
        const row = api.rowByIndex(rowIndex).get();
        if (!row) continue;

        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];

          const autoFn = (column as any).autosizeCellFn ?? (base as any).autosizeCellFn ?? defaultAutosize;
          const width = autoFn({ column, api, row });
          result[column.id] ??= 0;

          if (width != null) result[column.id] = Math.max(width, result[column.id]);
        }
      }
    }
  });
}
