import { GROUP_COLUMN_PREFIX, type ColumnAbstract, type ColumnView } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useColumnUpdate(
  view: ColumnView,
  providedColumns: ColumnAbstract[],
  onColumnsChange: (change: ColumnAbstract[]) => void,
  onRowGroupColumnChange: ((change: ColumnAbstract) => void) | undefined,
): Root.API["columnUpdate"] {
  return useEvent((updates) => {
    const columns = [...providedColumns];

    const groupColumns = view.visibleColumns.filter((c) => c.id.startsWith(GROUP_COLUMN_PREFIX));
    const groupColumn = groupColumns[0];

    if (groupColumn) {
      if (updates[groupColumn.id]) {
        const next = { ...groupColumn, ...updates[groupColumn.id] };
        onRowGroupColumnChange?.(next);
      }
    }

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (updates[column.id]) {
        const next = { ...column, ...updates[column.id] };
        columns[i] = next;
      }
    }
    onColumnsChange(columns);
  });
}
