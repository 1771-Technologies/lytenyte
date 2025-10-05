export const isAnchorElement = (el: HTMLElement | null | undefined): el is HTMLAnchorElement =>
  !!el?.matches("a[href]");
