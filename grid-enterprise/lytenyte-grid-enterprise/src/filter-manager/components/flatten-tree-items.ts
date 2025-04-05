import type { ColumnInFilterItem } from "@1771technologies/grid-types/pro";

export function flattenTreeItems(items: ColumnInFilterItem[], expansions: Set<string>) {
  const stack = [...items.map((c) => [c, 0] as [ColumnInFilterItem, number])];
  const flat: (ColumnInFilterItem & { depth: number })[] = [];

  while (stack.length) {
    const [item, depth] = stack.shift()!;

    if (item.kind === "parent" && expansions.has(item.label)) {
      const children = item.children.map((c) => [c, depth + 1] as [ColumnInFilterItem, number]);
      stack.unshift(...children);
    }
    flat.push({ ...item, depth });
  }

  return flat;
}
