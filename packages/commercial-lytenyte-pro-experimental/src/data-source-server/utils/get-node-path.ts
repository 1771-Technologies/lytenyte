import type { TreeParent, TreeRoot } from "../async-tree/types.js";

export function getNodePath(c: TreeRoot | TreeParent) {
  const path = [];
  let current = c;
  while (current.kind !== "root") {
    path.unshift(current.path);
    current = current.parent;
  }

  return path;
}
