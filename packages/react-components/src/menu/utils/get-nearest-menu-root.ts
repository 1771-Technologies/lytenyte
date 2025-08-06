import { isMenuItemParent } from "./is-menu-item-parent.js";

export function getNearestMenuRoot(ev: HTMLElement) {
  let current: HTMLElement | null = ev;

  /* v8 ignore next 3 */
  while (current && !isMenuItemParent(current)) {
    current = current.parentElement;
  }

  return current;
}
