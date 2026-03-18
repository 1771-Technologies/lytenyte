import { isDocument, isHTMLElement, isShadowRoot } from "../predicates/index.js";

export function getWindow(el: Node | ShadowRoot | Document | null | undefined) {
  if (isShadowRoot(el)) return getWindow(el.host);
  if (isDocument(el)) return el.defaultView ?? window;
  if (isHTMLElement(el)) return el.ownerDocument?.defaultView ?? window;
  return window;
}
