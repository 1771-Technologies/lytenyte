import type { ColumnInFilterItemParentPro } from "@1771technologies/grid-types/pro";

export function getChildValues(t: ColumnInFilterItemParentPro) {
  const stack = [...t.children];
  const values = new Set<unknown>();

  while (stack.length) {
    const t = stack.pop()!;

    if (t.kind === "leaf") values.add(t.value);
    else stack.push(...t.children);
  }

  return values;
}
