import { isHTMLElement } from "./is-html-element.js";

export const isElementVisible = (el: Node) => {
  if (!isHTMLElement(el)) return false;

  return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
};
