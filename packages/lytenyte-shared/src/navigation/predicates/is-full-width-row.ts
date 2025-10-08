export function isFullWidthRow(el: HTMLElement, gridId: string) {
  return (
    el.getAttribute("data-ln-rowtype") === "full-width" &&
    el.getAttribute("data-ln-gridid") === gridId
  );
}
