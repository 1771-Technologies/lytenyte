import type { RowSourceTree, UseTreeDataSourceParams } from "../use-tree-data-source";
import type { TreeRoot } from "../types";
import { useEvent } from "@1771technologies/lytenyte-core/internal";

export function useOnRowsUpdated<T>(tree: TreeRoot, p: UseTreeDataSourceParams<T>) {
  const onRowsUpdate: RowSourceTree<any>["onRowsUpdated"] = useEvent((updates) => {
    if (!p.onRowDataChange) return;

    const changes: { next: object; prev: object; parent: object; key: string; path: string[] }[] = [];
    const top = new Map<number, T>();
    const bottom = new Map<number, T>();

    for (const [row, u] of updates) {
      // Updating data
      if (row.kind === "branch") {
        const node = tree.rowIdToNode.get(row.id);
        if (!node) {
          console.error(`Attempting to update a node that does not exist: ${row.id}`);
          return;
        }
        let current = node.parent;
        const path: string[] = [];
        while (current.kind !== "root") {
          path.push(current.key);
          current = current.parent;
        }

        path.reverse();

        changes.push({
          key: node.key,
          next: u,
          parent: node?.parent.data,
          prev: node.data,
          path,
        });
        continue;
      }

      const topIndex = p.topData?.findIndex((r) => r.id === row.id);
      if (topIndex != null && topIndex !== -1) {
        top.set(topIndex, u);
        continue;
      }

      const botIndex = p.botData?.findIndex((r) => r.id === row.id);
      if (botIndex != null && botIndex !== -1) {
        bottom.set(botIndex, u);
        continue;
      }

      console.error(`Attempting to update a node that does not exist: ${row.id}`);
      return;
    }

    p.onRowDataChange({ changes, top, bottom });
  });

  return onRowsUpdate;
}
