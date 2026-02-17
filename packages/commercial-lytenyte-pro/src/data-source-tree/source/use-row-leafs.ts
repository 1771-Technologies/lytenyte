import { useEvent } from "@1771technologies/lytenyte-core/internal";
import type { TreeRoot } from "../types";
import type { RowSourceTree } from "../use-tree-data-source";

export function useRowLeafs(tree: TreeRoot) {
  const rowLeafs: RowSourceTree<any>["rowLeafs"] = useEvent((id) => {
    const node = tree.rowIdToNode.get(id);
    if (!node || !node.row.expandable) return [];

    const rows: string[] = [];

    const stack = [...node.children.values()];
    while (stack.length) {
      const next = stack.pop()!;

      if (!next.row.expandable) rows.push(next.row.id);
      else {
        stack.push(...next.children.values());
      }
    }

    return rows;
  });

  return rowLeafs;
}
