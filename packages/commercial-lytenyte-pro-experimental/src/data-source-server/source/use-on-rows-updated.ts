import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ServerData } from "../server-data";
import { type RowSourceServer, type UseServerDataSourceParams } from "../use-server-data-source.js";

export function useOnRowsUpdated<T>(
  source: ServerData,
  onRowDataChange: UseServerDataSourceParams<unknown[]>["onRowDataChange"],
  optimistic: UseServerDataSourceParams<unknown[]>["rowUpdateOptimistically"],
) {
  const onRowsUpdated: RowSourceServer<T>["onRowsUpdated"] = useEvent((updates) => {
    if (!onRowDataChange) return;

    if (!optimistic) {
      onRowDataChange?.({ rows: updates });
      return;
    }

    const rollbackMap = new Map<string, { data: T; asOf: number }>();
    updates.forEach((d, row) => {
      const node = source.tree.rowIdToNode.get(row.id);
      if (node) {
        rollbackMap.set(row.id, { data: node.row.data, asOf: node.asOf });
      }
      source.updateRow(row.id, d);
    });
    source.flatten();

    onRowDataChange({ rows: updates }).catch(() => {
      rollbackMap.forEach((d, id) => {
        source.updateRow(id, d.data, d.asOf);
      });
      source.flatten();
    });
  });

  return onRowsUpdated;
}
