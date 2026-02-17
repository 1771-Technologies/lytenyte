import { useEvent } from "@1771technologies/lytenyte-core/internal";
import type { TreeRoot } from "../types.js";
import type { RowSourceTree } from "../use-tree-data-source.js";

export function useRowById(tree: TreeRoot) {
  const rowById: RowSourceTree<any>["rowById"] = useEvent((id) => {
    return tree.rowIdToNode.get(id)?.row ?? null;
  });

  return rowById;
}
