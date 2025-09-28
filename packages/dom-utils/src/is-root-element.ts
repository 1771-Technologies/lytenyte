import { getNodeName } from "./get-node-name.js";

export function isRootElement(node: Node): boolean {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
