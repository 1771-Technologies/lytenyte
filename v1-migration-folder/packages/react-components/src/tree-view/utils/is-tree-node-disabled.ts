export function isTreeNodeDisabled(el: HTMLElement) {
  return el.getAttribute("data-ln-tree-node-disabled") === "true";
}
