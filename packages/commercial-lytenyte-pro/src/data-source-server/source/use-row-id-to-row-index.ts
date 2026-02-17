import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ServerData } from "../server-data.js";
import type { RowSourceServer } from "../use-server-data-source.js";

export function useRowIdToRowIndex<T>(source: ServerData) {
  const rowIdToRowIndex: RowSourceServer<T>["rowIdToRowIndex"] = useEvent((id) => {
    return source.flat.rowIdToRowIndex.get(id) ?? null;
  });

  return rowIdToRowIndex;
}
