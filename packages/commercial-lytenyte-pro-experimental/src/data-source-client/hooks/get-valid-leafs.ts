import type { RowLeaf } from "@1771technologies/lytenyte-shared";
import type { GroupNode } from "./use-group-tree/use-group-tree";

export function getValidLeafs<T>(node: GroupNode<T>, leafs: RowLeaf<T>[], workingSet: number[]) {
  const rows: RowLeaf[] = [];

  for (let i = 0; i < node.leafs.length; i++) {
    const x = node.leafs[i];
    const workingIndex = workingSet[x];
    const row = leafs[workingIndex];

    if (node.leafIds.has(row.id)) rows.push(row);
  }

  return rows;
}
