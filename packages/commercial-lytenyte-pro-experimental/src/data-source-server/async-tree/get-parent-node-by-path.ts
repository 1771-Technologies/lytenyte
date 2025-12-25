import type { LeafOrParent, TreeParent, TreeRoot } from "./+types.async-tree.js";

const invalidPathRoute = "Invalid path specified. Paths must be built up incrementally.";
const invalidPathChild = "Invalid path specified. Leaf nodes can have children.";

export function getParentNodeByPath<K, D>(tree: TreeRoot<K, D>, path: (string | null)[]) {
  let target: TreeParent<K, D> | TreeRoot<K, D> = tree;
  for (let i = 0; i < path.length; i++) {
    const next: LeafOrParent<K, D> | undefined = target.byPath.get(path[i]);

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
