export function isMenuItem(el: HTMLElement) {
  return el.getAttribute("data-ln-menu-item") === "true";
}
