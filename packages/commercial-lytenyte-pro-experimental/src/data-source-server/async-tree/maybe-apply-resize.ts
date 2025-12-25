import type { TreeParent, TreeRoot } from "./+types.async-tree.js";

export function maybeApplyResize(pathNode: TreeParent | TreeRoot, size: number | undefined, asOf: number) {
  if (size == null) return false;
  if (size === pathNode.size) return false;
  if (pathNode.asOf > asOf) return false;

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
