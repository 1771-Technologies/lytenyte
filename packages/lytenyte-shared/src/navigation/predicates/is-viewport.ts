export function isViewport(el: HTMLElement, gridId: string) {
  return (
    el.getAttribute("data-ln-viewport") === "true" && gridId === el.getAttribute("data-ln-gridid")
  );
}
