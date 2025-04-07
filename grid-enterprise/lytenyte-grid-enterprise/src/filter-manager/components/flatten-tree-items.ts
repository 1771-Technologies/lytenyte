import type { ColumnInFilterItemPro } from "@1771technologies/grid-types/pro";

export function flattenTreeItems(
  items: ColumnInFilterItemPro[],
  expansions: Set<string>,
): (ColumnInFilterItemPro & {
  depth: number;
})[] {
  const stack = [...items.map((c) => [c, 0] as [ColumnInFilterItemPro, number])];
  const flat: (ColumnInFilterItemPro & { depth: number })[] = [];

  while (stack.length) {
    const [item, depth] = stack.shift()!;

    if (item.kind === "parent" && expansions.has(item.label)) {
      const children = item.children.map((c) => [c, depth + 1] as [ColumnInFilterItemPro, number]);
      stack.unshift(...children);
    }
    flat.push({ ...item, depth });
  }

  return flat;
}
