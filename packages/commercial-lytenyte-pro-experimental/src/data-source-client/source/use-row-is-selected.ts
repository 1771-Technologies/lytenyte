import type { RowSource } from "@1771technologies/lytenyte-shared";
import type { RootNode } from "../hooks/use-group-tree/use-group-tree.js";
import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export function useRowIsSelected<T>(
  rowById: RowSource<T>["rowById"],
  selected: Set<string>,
  tree: RootNode<T> | null,
  rowsIsolatedSelection: boolean,
) {
  const rowIsSelected: RowSource<T>["rowIsSelected"] = useEvent((id) => {
    if (rowsIsolatedSelection) return selected.has(id);

    const row = rowById(id);
    if (!row) return false;
    if (row.kind === "leaf") return selected.has(id);

    const group = tree?.groupLookup.get(row.id);
    if (!group) return false;

    return group.leafIds.isSubsetOf(selected);
  });

  return rowIsSelected;
}
