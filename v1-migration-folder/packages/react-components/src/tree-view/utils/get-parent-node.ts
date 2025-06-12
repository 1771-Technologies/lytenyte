import { isBranchNode } from "./is-branch-node";

export function getParentNode(el: HTMLElement) {
  let current: HTMLElement | null = el.parentElement;

  while (current && !current.getAttribute("data-ln-tree-panel") && !isBranchNode(current)) {
    current = current.parentElement;
  }

  if (current?.getAttribute("data-ln-tree-panel")) return null;

  return current!;
}
