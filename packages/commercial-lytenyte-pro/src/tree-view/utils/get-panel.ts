export function getPanel(el: HTMLElement) {
  let current: HTMLElement | null = el;

  while (current && !current.getAttribute("data-ln-tree-panel")) {
    current = current.parentElement;
  }

  return current;
}
