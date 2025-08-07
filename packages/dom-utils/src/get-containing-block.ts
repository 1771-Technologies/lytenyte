import { getParentNode } from "./get-parent-node.js";
import { isContainingBlock } from "./is-containing-block.js";
import { isHTMLElement } from "./is-html-element.js";
import { isLastTraversableNode } from "./is-last-traversable-node.js";
import { isTopLayer } from "./is-top-layer.js";

export function getContainingBlock(element: Element): HTMLElement | null {
  let currentNode: Node | null = getParentNode(element);

  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }

    currentNode = getParentNode(currentNode);
  }

  return null;
}
