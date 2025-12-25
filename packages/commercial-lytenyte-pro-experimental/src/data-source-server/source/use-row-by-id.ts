import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer } from "../use-server-data-source";

export function useRowById<T>(source: ServerData) {
  const rowById: RowSourceServer<T>["rowById"] = useEvent((id) => {
    return source.flat.rowIdToRow.get(id) ?? null;
  });

  return rowById;
}
