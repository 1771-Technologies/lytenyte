export function getRowSpanFromEl(el: HTMLElement) {
  return Number.parseInt(el.getAttribute("data-ln-rowspan")!);
}
