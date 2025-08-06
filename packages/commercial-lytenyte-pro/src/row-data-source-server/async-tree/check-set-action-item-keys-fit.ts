import type { SetDataAction, TreeParent, TreeRoot } from "./+types.async-tree.js";

const invalidItemKeySize = "Invalid set action items, 'relIndex' must be less than parent size";

export function checkSetActionItemKeysFit<K, D>(
  p: SetDataAction<K, D>,
  pathNode: TreeParent<K, D> | TreeRoot<K, D>
) {
  // If we are not adding any items, then the items definitely fit - since 0 fits in 0.
  if (!p.items?.length) return true;

  // Grab the node size. The action may be updating the size, so we check for that first, otherwise
  // we check if the current size.
  const size = p.size ?? pathNode.size;

  // We check the relative item indices. They should be within the size.
  for (let i = p.items.length - 1; i >= 0; i--) {
    const x = p.items[i];
    if (x.relIndex >= size) {
      console.error(invalidItemKeySize, p, pathNode);
      return false;
    }
  }

  return true;
}
