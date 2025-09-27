export function isCell(el: HTMLElement) {
  return el.getAttribute("data-ln-cell") === "true";
}
