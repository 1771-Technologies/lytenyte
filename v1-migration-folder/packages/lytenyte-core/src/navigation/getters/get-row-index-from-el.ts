export function getRowIndexFromEl(el: HTMLElement) {
  return Number.parseInt(el.getAttribute("data-ln-rowindex")!);
}
