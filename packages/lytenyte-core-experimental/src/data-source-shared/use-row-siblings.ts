import type { RowSource } from "@1771technologies/lytenyte-shared";
import type { RootNode } from "../data-source/hooks/use-group-tree";
import { useEvent } from "../hooks/use-event.js";

export function useRowSiblings<T>(tree: RootNode<T> | null) {
  const rowSiblings: RowSource<T>["rowSiblings"] = useEvent((id) => {
    const group = tree?.groupLookup.get(id);
    const parent = group?.parent;
    if (!parent) return [];

    return [
      ...parent.children
        .values()
        .map((x) => (x.kind === "branch" ? x.row.id : null))
        .filter(Boolean),
    ] as string[];
  });

  return rowSiblings;
}
