import { isHTMLElement } from "./is-html-element.js";

/** Returns true if the element is an HTML input element. */
export const isInputElement = (el: any): el is HTMLInputElement =>
  isHTMLElement(el) && el.localName === "input";
