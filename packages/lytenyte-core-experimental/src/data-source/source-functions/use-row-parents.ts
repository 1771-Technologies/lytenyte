import type { GroupFn, GroupIdFn, RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../hooks/use-event.js";
import type { RootNode } from "../hooks/use-group-tree";

export function useRowParents<T>(
  rowById: RowSource<T>["rowById"],
  tree: RootNode<T> | null,
  group: GroupFn<T> | undefined,
  groupIdFn: GroupIdFn,
) {
  const rowParents: RowSource<T>["rowParents"] = useEvent((id) => {
    // Can't have parents if there are no groups.
    if (!tree) return [];

    const row = rowById(id);
    if (!row) return [];

    if (row.kind === "branch") {
      const group = tree?.groupLookup.get(row.id);
      if (!group) return [];

      const parents = [];
      let current = group.parent;
      while (current && current.kind !== "root") {
        parents.push(current.id);
        current = current.parent;
      }

      return parents;
    }

    const path = group!(row);
    if (!path?.length) return [];
    const groupId = groupIdFn(path);
    const groupNode = tree?.groupLookup.get(groupId);
    if (!groupNode) return [];

    const parents = [];
    let current = groupNode.parent;
    while (current && current.kind !== "root") {
      parents.push(current.id);
      current = current.parent;
    }

    return parents;
  });

  return rowParents;
}
