import type { TreeLeaf, TreeParent } from "../async-tree/types.js";

export function getNodeDepth(node: TreeParent | TreeLeaf) {
  let depth = 0;
  let current = node.parent;
  while (current && current.kind !== "root") {
    depth++;
    current = current.parent;
  }

  return depth;
}
