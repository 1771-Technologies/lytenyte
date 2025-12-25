import type { SetDataAction } from "./+types.async-tree.js";

export function checkSetActionItemKeysAreValid(p: SetDataAction) {
  if (!p.items?.length) return true;

  const items = p.items;
  for (let i = items.length - 1; i >= 0; i--) {
    const x = items[i];
    if (typeof x.relIndex !== "number" || x.relIndex < 0 || Math.floor(x.relIndex) !== x.relIndex) {
      return false;
    }
  }

  return true;
}
