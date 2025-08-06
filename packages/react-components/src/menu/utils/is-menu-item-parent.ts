export function isMenuItemParent(ev: HTMLElement) {
  return ev.getAttribute("data-ln-menu-root") === "true";
}
