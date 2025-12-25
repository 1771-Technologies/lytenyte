import type { SetDataAction, TreeParent, TreeRoot } from "./+types.async-tree.js";

export function isSetActionANoOpOnNode(p: SetDataAction, pathNode: TreeParent | TreeRoot) {
  return p.size === pathNode.size && !p.items?.length;
}
