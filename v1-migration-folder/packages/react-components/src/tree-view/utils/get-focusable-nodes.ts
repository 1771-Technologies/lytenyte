import { isHTMLElement } from "@1771technologies/lytenyte-dom-utils";
import { focusable } from "@1771technologies/lytenyte-focus";

export function getFocusableNodes(panel: HTMLElement) {
  const focusNodes = focusable(panel).filter(
    (c) => isHTMLElement(c) && c.getAttribute("data-ln-tree-node") === "true",
  ) as HTMLElement[];
  return focusNodes;
}
