import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ServerData } from "../server-data";
import type { RowSourceServer } from "../use-server-data-source";

export function useRowParents<T>(source: ServerData) {
  const rowParents: RowSourceServer<T>["rowParents"] = useEvent((id) => {
    const node = source.tree.rowIdToNode.get(id);
    if (!node) return [];

    const parents: string[] = [];
    let current = node.parent;
    while (current && current.kind !== "root") {
      parents.push(current.row.id);

      current = current.parent;
    }

    return parents.reverse();
  });

  return rowParents;
}
