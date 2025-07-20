import type { TreeParent, TreeRoot } from "./+types.async-tree.js";

export function maybeApplyResize<K, D>(
  pathNode: TreeParent<K, D> | TreeRoot<K, D>,
  size: number | undefined
) {
  if (size == null) return false;
  if (size === pathNode.size) return false;

  (pathNode as { size: number }).size = size;

  // Remove those nodes that are no long within the allowed size
  for (const [number, node] of pathNode.byIndex) {
    if (number >= size) {
      pathNode.byIndex.delete(number);
      pathNode.byPath.delete(node.path);
    }
  }

  return true;
}
