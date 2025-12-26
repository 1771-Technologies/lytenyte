import type { RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../hooks/use-event.js";
import type { RootNode } from "../data-source/hooks/use-group-tree.js";

export function useRowChildren<T>(tree: RootNode<T> | null) {
  const rowChildren: RowSource<T>["rowChildren"] = useEvent((id) => {
    const group = tree?.groupLookup.get(id);
    if (!group) return [];

    const ids = [...group.children.values()].map((x) => x.row.id);

    return ids;
  });

  return rowChildren;
}
