import type { TreeRoot } from "../types";
import type { RowSourceTree } from "../use-tree-data-source";
import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export function useRowChildren(tree: TreeRoot) {
  const rowChildren: RowSourceTree["rowChildren"] = useEvent((id) => {
    const node = tree.rowIdToNode.get(id);
    if (!node || node.kind === "leaf") return [];

    const ids = [...node.children.values()].map((x) => x.row.id);

    return ids;
  });

  return rowChildren;
}
