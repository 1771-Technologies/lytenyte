export function isLeafNode(el: HTMLElement) {
  return el.getAttribute("data-ln-tree-leaf") === "true";
}
