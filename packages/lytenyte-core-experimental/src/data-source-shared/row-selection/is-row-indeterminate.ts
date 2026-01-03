import type { RowSelectionStateWithParent, RowSelectNodeWithParent } from "@1771technologies/lytenyte-shared";

export function isRowIndeterminate(
  id: string,
  s: RowSelectionStateWithParent,
  getParents: (id: string) => string[],
) {
  // Isolated row selection does not support indeterminate.
  if (s.kind === "isolated") return false;

  const parents = getParents(id);
  parents.push(id);

  const base = s.selected;
  let current = s.children.get(parents[0]);
  if (!current) return base;

  for (const p of parents.slice(1)) {
    const next: RowSelectNodeWithParent | undefined = current?.children?.get(p);
    // We haven't finishing going down this path but have encountered the end.
    if (!next) {
      return false;
    } else {
      current = next;
    }
  }

  if (!current.children) return false;

  const stack = [...current.children.values()];

  while (stack.length) {
    const next = stack.pop()!;

    if (next.selected) return true;

    if (next.children) stack.push(...next.children.values());
  }

  return false;
}
