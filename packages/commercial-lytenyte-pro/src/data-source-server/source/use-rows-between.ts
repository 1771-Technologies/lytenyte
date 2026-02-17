import { useEvent } from "@1771technologies/lytenyte-core/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer } from "../use-server-data-source";

export function useRowsBetween<T>(source: ServerData) {
  const rowsBetween: RowSourceServer<T>["rowsBetween"] = useEvent((startId, endId) => {
    const left = source.flat.rowIdToRowIndex.get(startId);
    const right = source.flat.rowIdToRowIndex.get(endId);
    if (left == null || right == null) return [];

    const start = Math.min(left, right);
    const end = Math.max(left, right);

    const ids: string[] = [];

    for (let i = start; i <= end + 1; i++) {
      const row = source.flat.rowIndexToRow.get(i);
      if (!row) continue;
      ids.push(row.id);
    }

    return ids;
  });

  return rowsBetween;
}
