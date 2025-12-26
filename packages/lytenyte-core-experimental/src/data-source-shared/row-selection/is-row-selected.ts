import type { RowSelectionStateWithParent } from "@1771technologies/lytenyte-shared";
import { isRowSelectedInTree } from "./is-row-selected-in-tree.js";

export function isRowSelected(
  id: string,
  s: RowSelectionStateWithParent,
  getParents: (id: string) => string[],
) {
  if (s.kind === "isolated") {
    const isInExceptions = s.exceptions.has(id);
    return s.selected ? !isInExceptions : isInExceptions;
  }

  const parents = getParents(id);
  return isRowSelectedInTree(s.selected, s.children, parents.concat([id]));
}
