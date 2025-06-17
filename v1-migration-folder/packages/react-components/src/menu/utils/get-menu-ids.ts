export function getMenuIds(el: HTMLElement) {
  let current = el;

  const ids: string[] = [];
  while (current && current.getAttribute("data-ln-menu-panel") !== "true") {
    const id = current.getAttribute("data-ln-menu-id");
    if (id) ids.push(id);

    current = current.parentElement!;
  }

  return ids;
}
