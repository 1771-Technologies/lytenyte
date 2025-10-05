import { isNode } from "./is-node.js";

const DOCUMENT_FRAGMENT_NODE: typeof Node.DOCUMENT_FRAGMENT_NODE = 11;

export const isShadowRoot = (el: any): el is ShadowRoot =>
  isNode(el) && el.nodeType === DOCUMENT_FRAGMENT_NODE && "host" in el;
