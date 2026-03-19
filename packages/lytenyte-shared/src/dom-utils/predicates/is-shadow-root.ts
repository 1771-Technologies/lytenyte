import { isNode } from "./is-node.js";

const DOCUMENT_FRAGMENT_NODE: typeof Node.DOCUMENT_FRAGMENT_NODE = 11;

/** Returns true if the value is a ShadowRoot (a document fragment node with a host property). */
export const isShadowRoot = (el: any): el is ShadowRoot =>
  isNode(el) && el.nodeType === DOCUMENT_FRAGMENT_NODE && "host" in el;
