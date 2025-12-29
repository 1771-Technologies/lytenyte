import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { RowSourceServer } from "../use-server-data-source";
import type { ServerData } from "../server-data";

export function useRowLeafs<T>(source: ServerData) {
  const rowLeafs: RowSourceServer<T>["rowLeafs"] = useEvent((id) => {
    const node = source.tree.rowIdToNode.get(id);
    if (!node || node.kind === "leaf") return [];

    const rows: string[] = [];

    const stack = [...node.byIndex.values()];
    while (stack.length) {
      const next = stack.pop()!;

      if (next.kind === "leaf") rows.push(next.row.id);
      else {
        stack.push(...next.byIndex.values());
      }
    }

    return rows;
  });

  return rowLeafs;
}
