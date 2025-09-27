import { isHTMLElement } from "./is-html-element.js";

export const isFrame = (el: any): el is HTMLIFrameElement =>
  isHTMLElement(el) && el.tagName === "IFRAME";
