import type { TreeLeaf, TreeParent } from "../async-tree/+types.async-tree.js";

export function getNodeDepth(node: TreeParent<any, any> | TreeLeaf<any, any>) {
  let depth = 0;
  let current = node.parent;
  while (current && current.kind !== "root") {
    depth++;
    current = current.parent;
  }

  return depth;
}
