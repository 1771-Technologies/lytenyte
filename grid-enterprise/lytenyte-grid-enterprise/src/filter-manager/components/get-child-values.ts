import type { ColumnInFilterItemParent } from "@1771technologies/grid-types/enterprise";

export function getChildValues(t: ColumnInFilterItemParent) {
  const stack = [...t.children];
  const values = new Set<unknown>();

  while (stack.length) {
    const t = stack.pop()!;

    if (t.kind === "leaf") values.add(t.value);
    else stack.push(...t.children);
  }

  return values;
}
