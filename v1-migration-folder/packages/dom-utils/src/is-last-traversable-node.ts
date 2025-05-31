import { getNodeName } from "./get-node-name.js";

export function isLastTraversableNode(node: Node): boolean {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
