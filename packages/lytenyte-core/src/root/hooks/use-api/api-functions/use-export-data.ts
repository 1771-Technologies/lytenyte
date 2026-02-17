import type { ColumnView, RowNode, RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import { getDataRect } from "../auxiliary-functions/get-data-rect.js";

export function useExportData(
  view: ColumnView,
  source: RowSource,
  api: Root.API,
  rowCount: number,
): Root.API["exportData"] {
  return useEvent(async (p) => {
    const visible = view.visibleColumns;

    const rowStart = p?.rect?.rowStart ?? 0;
    const rowEnd = p?.rect?.rowEnd ?? rowCount;
    const columnStart = p?.rect?.columnStart ?? 0;
    const columnEnd = p?.rect?.columnEnd ?? visible.length;

    const rows: (RowNode<any> | null)[] = [];
    for (let i = rowStart; i < rowEnd; i++) {
      rows.push(source.rowByIndex(i).get() ?? null);
    }

    return getDataRect({
      rows,
      visible,
      columnField: api.columnField as any,
      columnEnd,
      columnStart,
    });
  });
}
