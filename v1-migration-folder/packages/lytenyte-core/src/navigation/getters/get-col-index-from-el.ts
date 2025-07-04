export function getColIndexFromEl(el: HTMLElement) {
  return Number.parseInt(el.getAttribute("data-ln-colindex")!);
}
