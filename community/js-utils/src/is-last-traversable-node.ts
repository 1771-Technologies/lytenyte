import { getNodeName } from "./get-node-name";

export function isLastTraversableNode(node: Node): boolean {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
