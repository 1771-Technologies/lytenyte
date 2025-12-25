import type { ServerData } from "../server-data.js";
import type { RowSourceServer } from "../use-server-data-source.js";

export function useRowIndexToRowId<T>(source: ServerData) {
  const rowIndexToRowId: RowSourceServer<T>["rowIndexToRowId"] = (index) => {
    return source.flat.rowIndexToRow.get(index)?.id ?? null;
  };

  return rowIndexToRowId;
}
