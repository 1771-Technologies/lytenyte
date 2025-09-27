import { isHTMLElement } from "./is-html-element.js";

export const isInputElement = (el: any): el is HTMLInputElement =>
  isHTMLElement(el) && el.localName === "input";
