/**
 * Returns true if the element has a negative tabindex attribute value.
 */
export const hasNegativeTabIndex = (el: Element) => parseInt(el.getAttribute("tabindex") || "0", 10) < 0;
