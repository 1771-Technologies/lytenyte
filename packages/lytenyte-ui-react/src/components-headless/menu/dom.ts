import { getActiveElement, getNearestMatching } from "@1771technologies/lytenyte-shared";

export function getActiveMenuItem() {
  return getNearestMatching(getActiveElement(document)!, isMenuItem);
}
export function getActiveMenuTrigger() {
  const item = getActiveMenuItem();
  if (!item) return null;

  const parent = getNearestMatching(item, isMenu)?.parentElement;
  if (!parent) return;

  const trigger = getNearestMatching(parent, isSubmenuTrigger);
  return trigger;
}

export function getDirectChildMenuItems(el: HTMLElement) {
  const menuItems = Array.from(
    el.querySelectorAll(
      'li[data-ln-menu-item="true"]:not([data-ln-disabled="true"])',
    ) as unknown as HTMLElement[],
  ).filter((x) => {
    const nearestMenu = getNearestMatching(x, isMenu);
    return nearestMenu === el;
  }) as HTMLElement[];

  return menuItems;
}

export function isSubmenuTrigger(el: HTMLElement) {
  return el.getAttribute("data-ln-menu-subtrigger") === "true";
}

export function isMenu(el: HTMLElement) {
  return el.getAttribute("data-ln-menu") === "true";
}

export function isMenuItem(el: HTMLElement) {
  return el.getAttribute("data-ln-menu-item") === "true";
}

export function dispatchHoverOpen(el: HTMLElement) {
  return el.dispatchEvent(new Event("ln-hover-open", { bubbles: false }));
}

export function dispatchKeyboardOpen(el: HTMLElement) {
  return el.dispatchEvent(new Event("ln-keyboard-open", { bubbles: false }));
}

export function dispatchKeyboardClose(el: HTMLElement) {
  return el.dispatchEvent(new Event("ln-keyboard-close", { bubbles: false }));
}
