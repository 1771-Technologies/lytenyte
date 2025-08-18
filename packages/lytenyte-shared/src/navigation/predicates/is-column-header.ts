export function isColumnHeader(el: HTMLElement) {
  return el.getAttribute("data-ln-header-cell") === "true";
}
