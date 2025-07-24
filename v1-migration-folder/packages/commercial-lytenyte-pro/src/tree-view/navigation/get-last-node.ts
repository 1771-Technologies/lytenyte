import { getFocusableNodes } from "../utils/get-focusable-nodes.js";
import { isTreeNodeDisabled } from "../utils/is-tree-node-disabled.js";

export function getLastNode(panel: HTMLElement) {
  const focusables = getFocusableNodes(panel);

  const first = focusables.findLast((c) => !isTreeNodeDisabled(c));

  return first;
}
