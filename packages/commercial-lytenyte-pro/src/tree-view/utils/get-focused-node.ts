import { isLastTraversableNode } from "@1771technologies/lytenyte-shared";

export function getFocusedNode() {
  if (!document.activeElement) return null;

  let current: Element | null = document.activeElement;
  while (
    current &&
    !isLastTraversableNode(current) &&
    current.getAttribute("data-ln-tree-node") !== "true"
  ) {
    current = current.parentElement;
  }

  if (current?.getAttribute("data-ln-tree-node")) return current as HTMLElement;
  return null;
}
