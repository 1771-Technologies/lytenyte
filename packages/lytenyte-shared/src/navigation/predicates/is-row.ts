export function isRow(el: HTMLElement, gridId: string) {
  return el.getAttribute("data-ln-row") === "true" && el.getAttribute("data-ln-gridid") === gridId;
}
