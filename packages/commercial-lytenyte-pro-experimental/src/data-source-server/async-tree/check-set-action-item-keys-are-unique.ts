import { ROOT_LEAF_PREFIX } from "./+constants.async-tree.js";
import type { SetDataAction } from "./+types.async-tree.js";

const invalidItemKeyDupes = "Invalid set action items, the same 'key' appears more than once";
const invalidItemPathsDupes = "Invalid set action items, the same 'path' appears more than once";

export function checkSetActionItemKeysAreUnique(p: SetDataAction) {
  const seenKeys = new Set<number>();
  const seenPaths = new Set<string | null>();
  if (!p.items?.length) return true;

  for (let i = p.items.length - 1; i >= 0; i--) {
    const item = p.items[i];

    if (seenKeys.has(item.relIndex)) {
      console.error(invalidItemKeyDupes, p);
      return false;
    }

    const pathId = item.kind === "leaf" ? `${p.path.at(-1) ?? ROOT_LEAF_PREFIX}#${item.relIndex}` : item.path;

    if (seenPaths.has(pathId)) {
      console.error(invalidItemPathsDupes, p);
      return false;
    }

    seenPaths.add(pathId);
    seenKeys.add(item.relIndex);
  }

  return true;
}
