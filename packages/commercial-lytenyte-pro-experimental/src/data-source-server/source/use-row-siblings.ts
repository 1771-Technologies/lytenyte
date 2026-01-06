import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer } from "../use-server-data-source";

export function useRowSiblings<T>(source: ServerData) {
  const rowChildren: RowSourceServer<T>["rowChildren"] = useEvent((id) => {
    const node = source.tree.rowIdToNode.get(id);
    const parent = node?.parent;
    if (!parent) return [];

    const ids: string[] = [];
    parent.byIndex.forEach((n) => {
      ids.push(n.row.id);
    });

    return ids;
  });

  return rowChildren;
}
