import { isHTMLElement } from "./is-html-element.js";

/** Returns true if the element is an iframe element. */
export const isFrame = (el: any): el is HTMLIFrameElement => isHTMLElement(el) && el.tagName === "IFRAME";
