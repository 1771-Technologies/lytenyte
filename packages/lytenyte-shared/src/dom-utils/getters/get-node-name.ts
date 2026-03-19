import { isHTMLElement } from "../predicates/index.js";

/** Returns the local name of an HTML element in lowercase, or '#document' for non-HTML elements. */
export function getNodeName(node: Node | Window): string {
  if (isHTMLElement(node)) return node.localName || "";
  return "#document";
}
