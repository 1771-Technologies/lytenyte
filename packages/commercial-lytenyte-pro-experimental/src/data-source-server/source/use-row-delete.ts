import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer, UseServerDataSourceParams } from "../use-server-data-source";
import type { Writable } from "@1771technologies/lytenyte-shared";
import type { LeafOrParent } from "../async-tree/types";

export function useRowDelete<T>(
  source: ServerData,
  onRowDelete: UseServerDataSourceParams<unknown[]>["onRowDelete"],
  optimistic: boolean = false,
) {
  const rowDelete: RowSourceServer<T>["rowDelete"] = useEvent((rows) => {
    if (!onRowDelete) return null;

    if (!optimistic) {
      onRowDelete({ rows });
      return;
    }

    const rollbackNodes: Writable<LeafOrParent>[] = [];
    rows.forEach((x) => {
      const node = source.tree.rowIdToNode.get(x.id) as Writable<LeafOrParent>;
      if (node) node.deleted = true;

      rollbackNodes.push(node);
    });

    onRowDelete({ rows }).catch(() => {
      rollbackNodes.forEach((x) => {
        delete x.deleted;
      });
      source.flatten();
    });

    source.flatten();
  });

  return rowDelete;
}
