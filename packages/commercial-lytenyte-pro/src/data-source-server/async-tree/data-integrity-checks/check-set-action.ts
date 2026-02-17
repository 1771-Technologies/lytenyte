import type { SetDataAction, TreeParent, TreeRoot } from "../types";
import { checkSetActionItemKeysAreUnique } from "./check-set-action-item-keys-are-unique.js";
import { checkSetActionItemKeysAreValid } from "./check-set-action-item-keys-are-valid.js";
import { checkSetActionItemKeysFit } from "./check-set-action-item-keys-fit.js";
import { checkSetActionItemKinds } from "./check-set-action-item-kinds.js";

export function checkSetAction(p: SetDataAction, pathNode: TreeRoot | TreeParent) {
  // We need to make sure that the items being added will fit path nodes specification.
  if (!checkSetActionItemKeysFit(p, pathNode)) {
    console.error("Invalid data dispatch", p);
    throw new Error(
      `Server data payload error occurred. The node at at ${p.path} has a size of ${pathNode.size} but data payload would exceed this size.`,
    );
  }

  // We need to ensure the kind of the data in the dispatch is valid.
  if (!checkSetActionItemKinds(p)) {
    console.error("Invalid data dispatch", p);
    throw new Error(
      `Server data payload error occurred. The payload has invalid data kinds. Each item must have kind "leaf" or "parent".`,
    );
  }
  if (!checkSetActionItemKeysAreValid(p)) {
    console.error("Invalid data dispatch", p);
    throw new Error(`Server data payload error occurred. The payload has invalid relIndex values.`);
  }
  if (!checkSetActionItemKeysAreUnique(p)) {
    console.error("Invalid data dispatch", p);
    throw new Error(`Server data payload error occurred. The payload has duplicated key items or paths.`);
  }
}
