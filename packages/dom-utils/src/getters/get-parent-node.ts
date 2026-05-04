import { getDocumentElement } from "./get-document-element.js";
import { getNodeName } from "./get-node-name.js";
import { isShadowRoot } from "../predicates/index.js";

/**
 * Returns the logical parent node of the given node, accounting for shadow roots, slots, and
 * assigned slots.
 */
export function getParentNode(node: Node): Node {
  if (getNodeName(node) === "html") return node;
  const result =
    (node as any).assignedSlot ||
    node.parentNode ||
    (isShadowRoot(node) && node.host) ||
    getDocumentElement(node);

  return isShadowRoot(result) ? result.host : result;
}
