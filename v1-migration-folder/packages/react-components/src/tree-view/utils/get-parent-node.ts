import { isBranchNode } from "./is-branch-node";

export function getParentNode(el: HTMLElement) {
  let current: HTMLElement | null = el.parentElement;

  while (current && current.parentElement?.role !== "tree" && !isBranchNode(current)) {
    current = current.parentElement;
  }

  if (current?.parentElement?.role === "tree") return null;

  return current!;
}
