import { SCOPE, STATE_CLEAN } from "../+constants.js";
import type { Computation } from "../+types.js";
import { updateCheck } from "./update-check.js";

export function runTop(node: Computation<any>) {
  const ancestors = [node];

  while ((node = node[SCOPE] as Computation<any>)) {
    if (node._effect && node._state !== STATE_CLEAN) ancestors.push(node);
  }

  for (let i = ancestors.length - 1; i >= 0; i--) {
    updateCheck(ancestors[i]);
  }
}
