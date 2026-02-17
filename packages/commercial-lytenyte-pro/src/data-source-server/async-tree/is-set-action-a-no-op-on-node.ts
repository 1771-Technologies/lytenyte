import type { SetDataAction, TreeParent, TreeRoot } from "./types.js";

export function isSetActionANoOpOnNode(p: SetDataAction, pathNode: TreeParent | TreeRoot) {
  return p.size === pathNode.size && !p.items?.length;
}
