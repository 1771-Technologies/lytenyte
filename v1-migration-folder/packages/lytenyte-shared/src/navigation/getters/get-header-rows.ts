export function getHeaderRows(el: HTMLElement) {
  const header = el.querySelector("[data-ln-header]") as HTMLElement;

  if (!header) return null;

  const rows = header.querySelectorAll("[data-ln-header-row]");
  return Array.from(rows) as HTMLElement[];
}
