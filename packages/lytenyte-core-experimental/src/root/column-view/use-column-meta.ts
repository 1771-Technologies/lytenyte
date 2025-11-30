import { useMemo } from "react";
import type { MakeColumnViewReturn } from "./column-view";
import type { ColumnMeta } from "../../types/column.js";

export function useColumnMeta<T>(columnView: MakeColumnViewReturn<T>) {
  const columnMeta = useMemo<ColumnMeta<T>>(() => {
    return {
      columnLookup: columnView.lookup,
      columnsVisible: columnView.visibleColumns,
      columnVisibleCenterCount: columnView.centerCount,
      columnVisibleEndCount: columnView.endCount,
      columnVisibleStartCount: columnView.startCount,
    };
  }, [
    columnView.centerCount,
    columnView.endCount,
    columnView.lookup,
    columnView.startCount,
    columnView.visibleColumns,
  ]);
  return columnMeta;
}
