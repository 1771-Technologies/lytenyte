import { getParentNode } from "./get-parent-node.js";
import { isHTMLElement } from "./is-html-element.js";
import { isLastTraversableNode } from "./is-last-traversable-node.js";
import { isOverflowElement } from "./is-overflow-element.js";

export function getNearestOverflowAncestor(node: Node): HTMLElement {
  const parentNode = getParentNode(node);

  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : (node as Document).body;
  }

  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }

  return getNearestOverflowAncestor(parentNode);
}
