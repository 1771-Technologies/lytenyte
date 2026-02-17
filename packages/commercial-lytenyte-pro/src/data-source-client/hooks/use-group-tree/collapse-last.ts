import { collapseChild } from "./collapse-child.js";
import type { GroupNode, LeafNode } from "./use-group-tree.js";

export const collapseLast = <T>(node: GroupNode<T> | LeafNode<T>) => {
  if (node.kind === "leaf") return;

  if (node.last) {
    if (node.children.size === 1) collapseChild(node);
    return;
  }

  const values = node.children.values();

  for (const v of values) {
    collapseLast(v);
  }
};
