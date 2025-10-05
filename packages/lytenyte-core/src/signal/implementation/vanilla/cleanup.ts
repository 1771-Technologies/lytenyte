import { SCOPE } from "../+constants.js";
import type { Computation } from "../+types.js";
import { dispose } from "./dispose.js";
import { emptyDisposal } from "./empty-disposal.js";

export function cleanup(node: Computation) {
  if (node._children) dispose.call(node, false);
  if (node._disposal) emptyDisposal(node);
  node._handlers = node[SCOPE] ? node[SCOPE]._handlers : null;
}
