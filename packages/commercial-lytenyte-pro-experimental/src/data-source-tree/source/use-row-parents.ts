import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { TreeRoot } from "../types.js";
import type { RowSourceTree } from "../use-tree-data-source.js";

export function useRowParents(tree: TreeRoot) {
  const rowParents: RowSourceTree["rowParents"] = useEvent((id) => {
    const node = tree.rowIdToNode.get(id);
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
