import { SCOPE, STATE_DISPOSED } from "../+constants.js";
import { G } from "../+globals.js";
import type { Computation } from "../+types.js";
import { emptyDisposal } from "./empty-disposal.js";
import { removeSourceObservers } from "./remove-source-observers.js";

export function disposeNode(node: Computation) {
  node._state = STATE_DISPOSED;
  if (node._disposal) emptyDisposal(node);
  if (node._sources) removeSourceObservers(node, 0);
  node[SCOPE] = null;
  node._sources = null;
  node._observers = null;
  node._children = null;
  node._context = G.defaultContext;
  node._handlers = null;
}
