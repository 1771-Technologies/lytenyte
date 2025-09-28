export function isDetailCell(el: HTMLElement) {
  return el.getAttribute("data-ln-row-detail") === "true";
}
