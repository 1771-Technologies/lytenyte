import { getNodeName } from "../getters/get-node-name.js";

/** Returns true if the node is a root element: html, body, or #document. */
export function isRootElement(node: Node): boolean {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
