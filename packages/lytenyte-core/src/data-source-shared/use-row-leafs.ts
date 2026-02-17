import type { RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../hooks/use-event.js";
import type { RootNode } from "../data-source/hooks/use-group-tree.js";

export function useRowLeafs<T>(tree: RootNode<T> | null) {
  const rowLeafs: RowSource<T>["rowLeafs"] = useEvent((id) => {
    const group = tree?.groupLookup.get(id);
    if (!group) return [];

    return [...group.leafIds];
  });

  return rowLeafs;
}
