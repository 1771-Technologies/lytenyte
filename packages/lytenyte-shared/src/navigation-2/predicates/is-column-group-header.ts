export function isColumnGroupHeader(el: HTMLElement) {
  return el.getAttribute("data-ln-header-group") === "true";
}
