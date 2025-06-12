import { getFocusableNodes } from "../utils/get-focusable-nodes.js";
import { getPanel } from "../utils/get-panel.js";

// Assumes that el is a branch or leaf node
export function getPrevNode(el: HTMLElement) {
  const panel = getPanel(el);

  if (!panel) return;
  const focusables = getFocusableNodes(panel);
  const index = focusables.indexOf(el);
  if (index === -1) return;

  return focusables[index - 1];
}
