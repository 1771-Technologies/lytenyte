export function dispatchActivate(el: HTMLElement) {
  return el.dispatchEvent(new Event("ln-activate-mouse", { bubbles: false }));
}
export function dispatchDeactivate(el: HTMLElement) {
  return el.dispatchEvent(new Event("ln-deactivate-mouse", { bubbles: false }));
}
export function dispatchClose(el: HTMLElement) {
  return el.dispatchEvent(new Event("ln-close", { bubbles: false }));
}

export function getSubmenuRoots(el: HTMLElement) {
  let current = el;
  const roots: HTMLElement[] = [];
  while (current && current.getAttribute("data-ln-terminal-menu") !== "true") {
    if (current.getAttribute("data-ln-submenu-root") === "true") {
      roots.push(current);
    }
    current = current.parentElement as HTMLElement;
  }

  return roots;
}
