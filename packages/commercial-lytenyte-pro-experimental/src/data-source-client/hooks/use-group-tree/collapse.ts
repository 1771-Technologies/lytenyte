import { collapseChild } from "./collapse-child.js";
import type { GroupNode, LeafNode } from "./use-group-tree.js";

export const collapse = <T>(node: GroupNode<T> | LeafNode<T>) => {
  if (node.kind === "leaf") return;

  // This node has multiple children. For each child we should call collapse, but this node
  // itself will not be collapsed.
  if (node.children.size > 1) {
    const values = node.children.values();

    for (const v of values) {
      collapse(v);
    }
    return;
  }

  // If we've reached here it means that this node has a single child. This means we need to
  // replace it in its parent.
  collapse(collapseChild(node));
};
