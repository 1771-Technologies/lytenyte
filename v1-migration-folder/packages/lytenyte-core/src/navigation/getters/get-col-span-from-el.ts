export function getColSpanFromEl(el: HTMLElement) {
  return Number.parseInt(el.getAttribute("data-ln-colspan")!);
}
