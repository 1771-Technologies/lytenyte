import type { SetDataAction } from "./+types.async-tree.js";

const invalidItemKind = "Invalid set action items, 'kind' must be 'leaf' or 'parent'";

export function checkSetActionItemKinds(p: SetDataAction) {
  if (!p.items?.length) return true;

  const items = p.items;

  for (let i = items.length - 1; i >= 0; i--) {
    const x = items[i];
    if (x.kind !== "leaf" && x.kind !== "parent") {
      console.error(invalidItemKind, p);
      return false;
    }
  }

  return true;
}
