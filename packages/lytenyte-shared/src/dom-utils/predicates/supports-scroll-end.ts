/** Returns true if the element supports the scrollend event. */
export function supportsScrollEnd(el: HTMLElement) {
  return "onscrollend" in el;
}
