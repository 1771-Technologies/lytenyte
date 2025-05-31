import { getNodeName } from "./get-node-name.js";

export function isTableElement(element: Element): boolean {
  return ["table", "td", "th"].includes(getNodeName(element));
}
