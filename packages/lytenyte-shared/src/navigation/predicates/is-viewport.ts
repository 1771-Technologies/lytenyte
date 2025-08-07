export function isViewport(el: HTMLElement) {
  return el.getAttribute("data-ln-viewport") === "true";
}
