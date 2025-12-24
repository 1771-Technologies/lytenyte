import { get, type ColumnView, type RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root";
import type { Column } from "../../../../types/column.js";

export function useColumnField(view: ColumnView, source: RowSource): Root.API["columnField"] {
  return useEvent((col, row) => {
    const column = typeof col === "string" ? view.lookup.get(col) : col;
    if (!column) {
      console.error(`Attempting to compute the field of a column that is not defined`, column);
      return null;
    }

    const field = (column as Column).field ?? column.id;
    if (row.kind === "branch") {
      if (typeof field === "function") return field({ row, source });
      if (!row.data) return null;
      return row.data[column.id];
    }

    if (typeof field === "function") return field({ row, source });
    else if (!row.data) return null;
    else if (typeof field === "object") return get(row.data, (field as { path: string }).path);

    return (row.data as any)[field] as unknown;
  });
}
