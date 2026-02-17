import type { TreeRoot } from "../types";
import type { RowSourceTree } from "../use-tree-data-source";
import { useEvent } from "@1771technologies/lytenyte-core/internal";

export function useRowSiblings(tree: TreeRoot) {
  const rowChildren: RowSourceTree<any>["rowChildren"] = useEvent((id) => {
    const node = tree.rowIdToNode.get(id);
    const parent = node?.parent;
    if (!parent) return [];

    const ids = [...parent.children.values()].map((x) => x.row.id);

    return ids;
  });

  return rowChildren;
}
