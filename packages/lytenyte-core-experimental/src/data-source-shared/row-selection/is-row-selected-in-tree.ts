import type {
  RowSelectionLinkedWithParent,
  RowSelectNodeWithParent,
} from "@1771technologies/lytenyte-shared";

export function isRowSelectedInTree(
  base: boolean,
  overrides: RowSelectionLinkedWithParent["children"],
  path: string[],
) {
  let current = overrides.get(path[0]);
  if (!current) return base;

  for (const p of path.slice(1)) {
    const next: RowSelectNodeWithParent | undefined = current?.children?.get(p);
    // We haven't finishing going down this path but have encountered the end.
    if (!next) {
      return current.selected ?? base;
    } else {
      current = next;
    }
  }

  if (current.exceptions?.size) return false;

  // We arrived at the end
  return current.selected ?? base;
}
