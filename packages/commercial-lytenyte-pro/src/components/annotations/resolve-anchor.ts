import { useMemo } from "react";
import type { ColumnAbstract, RowSource } from "@1771technologies/lytenyte-shared";
import type { AnnotationIndexOrId } from "./types.js";

export function resolveRowIndex(value: AnnotationIndexOrId, rowSource: RowSource): number | null {
  if (typeof value === "number") return value;
  return rowSource.rowIdToRowIndex(value) ?? null;
}
export function resolveColumnIndex(
  value: AnnotationIndexOrId,
  colIdToIndex: ReadonlyMap<string, number>,
): number | null {
  if (typeof value === "number") return value;
  return colIdToIndex.get(value) ?? null;
}

export function useColumnIdToIndex(visibleColumns: readonly ColumnAbstract[]): ReadonlyMap<string, number> {
  return useMemo(() => {
    const map = new Map<string, number>();
    visibleColumns.forEach((c, i) => map.set(c.id, i));
    return map;
  }, [visibleColumns]);
}
