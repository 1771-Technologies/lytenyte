import type { SetDataAction, TreeRoot } from "./+types.async-tree.js";
import { maybeApplyParentRemoveSelf } from "./maybe-apply-parent-remove-self.js";
import { checkSetActionItemKeysAreUnique } from "./check-set-action-item-keys-are-unique.js";
import { checkSetActionItemKeysAreValid } from "./check-set-action-item-keys-are-valid.js";
import { checkSetActionItemKeysFit } from "./check-set-action-item-keys-fit.js";
import { checkSetActionItemKinds } from "./check-set-action-item-kinds.js";
import { getParentNodeByPath } from "./get-parent-node-by-path.js";
import { isSetActionANoOpOnNode } from "./is-set-action-a-no-op-on-node.js";
import { maybeApplyResize } from "./maybe-apply-resize.js";
import { maybeApplySetActionItems } from "./maybe-apply-set-action-items.js";

export function applySetActionToTree<K, D>(p: SetDataAction<K, D>, root: TreeRoot<K, D>) {
  // If we are not adding items and we are not resizing a node, then we just
  // return our previous data and skip the update. This is effectively a no-op.
  if (!p.items?.length && p.size == null) return false;

  // We need to find the parent that we are adding data to. Its possible the path is invalid.
  // If we encounter an invalid path we return early without change. An invalid path is a
  // path that does not exist or where there is a leaf node at some point in the path.
  const pathNode = getParentNodeByPath(root, p.path);
  if (!pathNode) return false;

  if (!checkSetActionItemKeysFit(p, pathNode)) return false;
  if (!checkSetActionItemKinds(p)) return false;
  if (!checkSetActionItemKeysAreValid(p)) return false;
  if (!checkSetActionItemKeysAreUnique(p)) return false;

  if (isSetActionANoOpOnNode(p, pathNode)) return false;

  maybeApplyResize(pathNode, p.size);
  if (maybeApplyParentRemoveSelf(pathNode)) return true;

  maybeApplySetActionItems(p, pathNode);

  return true;
}
