export function isSameDepth(left: HTMLElement, right: HTMLElement) {
  const leftDepth = left.getAttribute("data-ln-depth");
  const rightDepth = right.getAttribute("data-ln-depth");

  return leftDepth != null && rightDepth != null && rightDepth === leftDepth;
}
