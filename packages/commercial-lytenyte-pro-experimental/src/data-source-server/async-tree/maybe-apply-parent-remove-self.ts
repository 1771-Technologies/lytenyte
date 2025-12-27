import type { TreeParent, TreeRoot } from "./types.js";

export function maybeApplyParentRemoveSelf(pathNode: TreeParent | TreeRoot) {
  if (!pathNode.size && pathNode.kind === "parent") {
    pathNode.parent.byPath.delete(pathNode.path);
    pathNode.parent.byIndex.delete(pathNode.relIndex);

    return true;
  }

  return false;
}
