export function isColumnFloatingHeader(el: HTMLElement) {
  return el.getAttribute("data-ln-header-floating") === "true";
}
