import { getFocusables, isHTMLElement } from "@1771technologies/lytenyte-dom-utils";

export function getFocusableNodes(panel: HTMLElement) {
  const focusNodes = getFocusables(panel).filter(
    (c) => isHTMLElement(c) && c.getAttribute("data-ln-tree-node") === "true",
  ) as HTMLElement[];
  return focusNodes;
}
