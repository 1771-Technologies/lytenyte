import type { DeleteDataAction, TreeRoot } from "./types";
import { getParentNodeByPath } from "./get-parent-node-by-path.js";

export function applyDeleteActionToTree(p: DeleteDataAction, tree: TreeRoot) {
  // No op. We aren't deleting keys or indices
  if (!p.relIndices?.length && !p.paths?.length) return;

  const parentNode = getParentNodeByPath(tree, p.path);
  if (!parentNode) return;

  if (p.relIndices) {
    for (const rel of p.relIndices) {
      const node = parentNode.byIndex.get(rel);
      if (!node) continue;
      parentNode.byPath.delete(node.path);
      parentNode.byIndex.delete(rel);
    }
  }
  if (p.paths) {
    for (const path of p.paths) {
      const node = parentNode.byPath.get(path);
      if (!node) continue;
      parentNode.byPath.delete(node.path);
      parentNode.byIndex.delete(node.relIndex);
    }
  }
}
