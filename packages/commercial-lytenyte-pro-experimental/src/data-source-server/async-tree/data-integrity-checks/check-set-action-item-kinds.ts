import type { SetDataAction } from "../types.js";

export function checkSetActionItemKinds(p: SetDataAction) {
  if (!p.items?.length) return true;

  const items = p.items;

  for (let i = items.length - 1; i >= 0; i--) {
    const x = items[i];
    if (x.kind !== "leaf" && x.kind !== "parent") {
      return false;
    }
  }

  return true;
}
