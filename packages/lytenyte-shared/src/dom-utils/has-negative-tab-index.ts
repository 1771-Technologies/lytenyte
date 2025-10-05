export const hasNegativeTabIndex = (el: Element) =>
  parseInt(el.getAttribute("tabindex") || "0", 10) < 0;
