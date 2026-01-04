import type { RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../hooks/use-event.js";
import type { RefObject } from "react";

export function useRowsBetween<T>(
  rowIdToRowIndexRef: RefObject<Map<string, number>>,
  rowByIndex: RowSource<T>["rowByIndex"],
) {
  const rowsBetween: RowSource<T>["rowsBetween"] = useEvent((startId, endId) => {
    const left = rowIdToRowIndexRef.current.get(startId);
    const right = rowIdToRowIndexRef.current.get(endId);
    if (left == null || right == null) return [];

    const start = Math.min(left, right);
    const end = Math.max(left, right);

    const ids: string[] = [];
    for (let i = start; i <= end; i++) {
      const row = rowByIndex(i).get();
      if (!row) continue;

      ids.push(row.id);
    }

    return ids;
  });

  return rowsBetween;
}
