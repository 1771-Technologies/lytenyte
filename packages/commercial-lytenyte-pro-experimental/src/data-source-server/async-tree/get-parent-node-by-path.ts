import type { LeafOrParent, TreeParent, TreeRoot } from "./+types.async-tree.js";

const invalidPathRoute = "Invalid path specified. Paths must be built up incrementally.";
const invalidPathChild = "Invalid path specified. Leaf nodes can have children.";

export function getParentNodeByPath(tree: TreeRoot, path: (string | null)[]) {
  let target: TreeParent | TreeRoot = tree;
  for (let i = 0; i < path.length; i++) {
    const next: LeafOrParent | undefined = target.byPath.get(path[i]);

    if (!next) {
      console.error(invalidPathRoute, path.slice(0, i));
      return null;
    }
    if (next.kind === "leaf") {
      console.error(invalidPathChild, path.slice(0, i));
      return null;
    }

    target = next;
  }

  return target;
}
