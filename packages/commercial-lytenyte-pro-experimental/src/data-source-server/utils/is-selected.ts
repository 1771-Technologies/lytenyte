import type { RowSelectionStateWithParent } from "@1771technologies/lytenyte-shared";
import { isSelectedTree } from "./is-selected-tree.js";

export function isSelected(id: string, s: RowSelectionStateWithParent, getParents: (id: string) => string[]) {
  if (s.kind === "isolated") {
    const isInExceptions = s.exceptions.has(id);
    return s.selected ? !isInExceptions : isInExceptions;
  }

  const parents = getParents(id);
  return isSelectedTree(s.selected, s.children, parents.concat([id]));
}
