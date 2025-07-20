import type { SetDataAction, TreeParent, TreeRoot } from "./+types.async-tree.js";

export function isSetActionANoOpOnNode<K, D>(
  p: SetDataAction<K, D>,
  pathNode: TreeParent<K, D> | TreeRoot<K, D>
) {
  return p.size === pathNode.size && !p.items?.length;
}
