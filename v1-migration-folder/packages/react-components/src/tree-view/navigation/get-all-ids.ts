import { getFocusableNodes } from "../utils/get-focusable-nodes.js";
import { getTreeNodeId } from "../utils/get-tree-node-id.js";

export function getAllIds(panel: HTMLElement) {
  const focusables = getFocusableNodes(panel);

  const allIds = new Set(focusables.map((c) => getTreeNodeId(c)));

  return allIds;
}
