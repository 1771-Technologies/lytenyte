import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer } from "../use-server-data-source";

export function useRowById<T>(source: ServerData) {
  const rowById: RowSourceServer<T>["rowById"] = useEvent((id) => {
    const node = source.tree.rowIdToNode.get(id)?.row;

    return node ?? null;
  });

  return rowById;
}
