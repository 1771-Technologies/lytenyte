export function getTreeNodeId(el: HTMLElement) {
  return el.getAttribute("data-ln-tree-id") ?? "";
}
