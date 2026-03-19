/** Returns true if the element is an anchor element with an href attribute. */
export const isAnchorElement = (el: HTMLElement | null | undefined): el is HTMLAnchorElement =>
  !!el?.matches("a[href]");
