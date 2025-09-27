import { isHTMLElement } from "./is-html-element.js";

export function getNodeName(node: Node | Window): string {
  if (isHTMLElement(node)) return node.localName || "";
  return "#document";
}
