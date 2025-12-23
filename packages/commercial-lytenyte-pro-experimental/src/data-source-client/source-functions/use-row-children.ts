import type { RowSource } from "@1771technologies/lytenyte-shared";
import type { RootNode } from "../hooks/use-group-tree/use-group-tree.js";
import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export function useRowChildren<T>(tree: RootNode<T> | null) {
  const rowChildren: RowSource<T>["rowChildren"] = useEvent((id) => {
    const group = tree?.groupLookup.get(id);
    if (!group) return [];

    const ids = [...group.children.values()].map((x) => x.row.id);

    return ids;
  });

  return rowChildren;
}
