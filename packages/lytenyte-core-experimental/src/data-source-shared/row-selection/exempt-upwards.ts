import type { RowSelectNodeWithParent } from "@1771technologies/lytenyte-shared";

export function exemptUpwards(id: string, node: RowSelectNodeWithParent, deselect: boolean) {
  const parent = node.parent;

  if (deselect) {
    parent.exceptions ??= new Set();
    parent.exceptions.add(id);

    if (!("kind" in parent)) exemptUpwards(parent.id, parent, deselect);
  } else {
    if (!parent.exceptions) return;

    parent.exceptions.delete(id);
    if (parent.exceptions.size === 0) parent.exceptions = undefined;

    if (!("kind" in parent)) exemptUpwards(parent.id, parent, !!parent.exceptions?.size);
  }
}
