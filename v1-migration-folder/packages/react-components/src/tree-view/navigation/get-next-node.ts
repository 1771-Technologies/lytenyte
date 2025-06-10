import { getFocusableNodes } from "../utils/get-focusable-nodes";
import { getPanel } from "../utils/get-panel";

// Assumes that el is a branch or leaf node
export function getNextNode(el: HTMLElement) {
  const panel = getPanel(el);

  if (!panel) return;
  const focusables = getFocusableNodes(panel);
  const index = focusables.indexOf(el);
  if (index === -1) return;

  return focusables.at(index + 1);
}
