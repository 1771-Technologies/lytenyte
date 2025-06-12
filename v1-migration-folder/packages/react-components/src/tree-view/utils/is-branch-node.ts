export function isBranchNode(el: HTMLElement) {
  return el.getAttribute("data-ln-tree-branch") === "true";
}
