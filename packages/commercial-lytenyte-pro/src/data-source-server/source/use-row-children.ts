import { useEvent } from "@1771technologies/lytenyte-core/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer } from "../use-server-data-source";

export function useRowChildren<T>(source: ServerData) {
  const rowChildren: RowSourceServer<T>["rowChildren"] = useEvent((id) => {
    const node = source.tree.rowIdToNode.get(id);
    if (!node) return [];

    if (node.kind === "leaf") return [];

    const ids: string[] = [];
    node.byIndex.forEach((n) => {
      ids.push(n.row.id);
    });

    return ids;
  });

  return rowChildren;
}
