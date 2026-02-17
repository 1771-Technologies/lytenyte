import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer } from "../use-server-data-source";

export function useRowIndexToRowId<T>(source: ServerData) {
  const rowIndexToRowId: RowSourceServer<T>["rowIndexToRowId"] = useEvent((index) => {
    return source.flat.rowIndexToRow.get(index)?.id ?? null;
  });

  return rowIndexToRowId;
}
