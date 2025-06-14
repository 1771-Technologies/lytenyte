import { getFocusableNodes } from "./get-focusable-nodes.js";
import { getTreeNodeId } from "./get-tree-node-id.js";

export function getIdsBetweenNodes(start: HTMLElement, end: HTMLElement, panel: HTMLElement) {
  const focusables = getFocusableNodes(panel);

  let startIndex = focusables.indexOf(start);
  let endIndex = focusables.indexOf(end);
  if (startIndex == -1 || endIndex == -1) return [];

  [startIndex, endIndex] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];

  const ids: string[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    ids.push(getTreeNodeId(focusables[i]));
  }

  return ids;
}
