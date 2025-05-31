import { getDocumentElement } from "./get-document-element.js";
import { getNodeName } from "./get-node-name.js";
import { isShadowRoot } from "./is-shadow-root.js";

export function getParentNode(node: Node): Node {
  if (getNodeName(node) === "html") {
    return node;
  }

  const result =
    // Step into the shadow DOM of the parent of a slotted node.
    (node as any).assignedSlot ||
    // DOM Element detected.
    node.parentNode ||
    // ShadowRoot detected.
    /* v8 ignore next 1 */
    (isShadowRoot(node) && node.host) ||
    // Fallback.
    getDocumentElement(node);

  return isShadowRoot(result) ? result.host : result;
}
