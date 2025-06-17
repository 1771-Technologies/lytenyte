import type { Base, Item } from "./+types";

export function filterHiddenColumns(c: Item[], base: Base) {
  const filtered: Item[] = [];

  for (let i = 0; i < c.length; i++) if (!(c[i].hide ?? base.hide)) filtered.push(c[i]);

  return filtered;
}
