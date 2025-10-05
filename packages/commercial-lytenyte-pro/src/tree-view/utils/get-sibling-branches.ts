import { isHTMLElement } from "@1771technologies/lytenyte-shared";
import { isBranchNode } from "./is-branch-node.js";

export function getSiblingBranches(el: HTMLElement) {
  const children = el.parentElement?.children;
  if (!children) return;

  const branchSiblings: HTMLElement[] = [];
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (isHTMLElement(node) && isBranchNode(node)) branchSiblings.push(node);
  }

  return branchSiblings;
}
