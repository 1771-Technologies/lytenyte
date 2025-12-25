import type { TreeParent, TreeRoot } from "../async-tree/+types.async-tree.js";

export function getNodePath<T, K>(c: TreeRoot<T, K> | TreeParent<T, K>) {
  const path = [];
  let current = c;
  while (current.kind !== "root") {
    path.unshift(current.path);
    current = current.parent;
  }

  return path;
}
