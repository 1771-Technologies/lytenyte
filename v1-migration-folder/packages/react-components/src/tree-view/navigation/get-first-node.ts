import { getFocusableNodes } from "../utils/get-focusable-nodes";
import { isTreeNodeDisabled } from "../utils/is-tree-node-disabled";

export function getFirstNode(panel: HTMLElement) {
  const focusables = getFocusableNodes(panel);

  const first = focusables.find((c) => !isTreeNodeDisabled(c));

  return first;
}
