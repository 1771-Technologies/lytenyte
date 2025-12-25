import type { RowSource } from "@1771technologies/lytenyte-shared";
import type { RootNode } from "../hooks/use-group-tree/use-group-tree.js";
import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export function useRowLeafs<T>(tree: RootNode<T> | null) {
  const rowLeafs: RowSource<T>["rowLeafs"] = useEvent((id) => {
    const group = tree?.groupLookup.get(id);
    if (!group) return [];

    return [...group.leafIds];
  });

  return rowLeafs;
}
