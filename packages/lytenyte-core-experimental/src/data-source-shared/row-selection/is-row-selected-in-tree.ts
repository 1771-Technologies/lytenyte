import type {
  RowSelectionLinkedWithParent,
  RowSelectNodeWithParent,
} from "@1771technologies/lytenyte-shared";
import { isNodeSelected } from "./is-node-selected.js";

export function isRowSelectedInTree(
  base: boolean,
  overrides: RowSelectionLinkedWithParent["children"],
  path: string[],
) {
  let current = overrides.get(path[0]);
  if (!current) return base;

  let full = true;
  for (const p of path.slice(1)) {
    const next: RowSelectNodeWithParent | undefined = current?.children?.get(p);
    // We haven't finishing going down this path but have encountered the end.
    if (!next) {
      full = false;
      break;
    } else {
      current = next;
    }
  }

  const isCurrentSelect = isNodeSelected(current);

  if (!isCurrentSelect) return false;
  if (!full || !current.children) return true;

  const stack = [...current.children.values()];
  while (stack.length) {
    const v = stack.pop()!;
    if (v.selected == false) return false;

    if (v.children) stack.push(...v.children.values());
  }

  return isCurrentSelect;
}
