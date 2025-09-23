import { isDocument } from "./is-document.js";
import { isHTMLElement } from "./is-html-element.js";
import { isShadowRoot } from "./is-shadow-root.js";

export function getWindow(el: Node | ShadowRoot | Document | null | undefined) {
  if (isShadowRoot(el)) return getWindow(el.host);
  if (isDocument(el)) return el.defaultView ?? window;
  if (isHTMLElement(el)) return el.ownerDocument?.defaultView ?? window;
  return window;
}
