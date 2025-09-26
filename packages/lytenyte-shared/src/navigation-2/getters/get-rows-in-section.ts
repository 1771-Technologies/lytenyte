export function getRowsInSection(el: HTMLElement, id: string) {
  return Array.from(el.querySelectorAll(`[data-ln-row][data-ln-gridid="${id}"]`)) as HTMLElement[];
}
