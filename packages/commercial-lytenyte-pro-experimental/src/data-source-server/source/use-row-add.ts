import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer, UseServerDataSourceParams } from "../use-server-data-source";
import type { TreeLeaf } from "../async-tree/types";
import { ROOT_LEAF_PREFIX } from "../async-tree/+constants.async-tree.js";

export function useRowAdd<T>(
  source: ServerData,
  onRowAdd: UseServerDataSourceParams<any, unknown[]>["onRowsAdded"],
  optimistic = false,
) {
  const rowAdd: RowSourceServer<T>["rowAdd"] = useEvent((rows, placement = "start") => {
    if (!onRowAdd || !rows.length) return;

    if (!optimistic) {
      onRowAdd({ rows, placement });
      return;
    }

    const toNodes = rows.map<TreeLeaf>((x) => {
      return {
        asOf: Date.now(),
        kind: "leaf",
        parent: source.tree,
        path: ROOT_LEAF_PREFIX,
        relIndex: -1,
        row: x,
        optimistic: placement,
      };
    });

    if (placement === "start") source.addBefore(toNodes);
    else source.addAfter(toNodes);

    source.flatten();

    onRowAdd({ rows, placement }).catch(() => {
      if (placement === "start") source.deleteBefore(toNodes.map((x) => x.row.id));
      else source.deleteAfter(toNodes.map((x) => x.row.id));

      source.flatten();
    });
  });

  return rowAdd;
}
