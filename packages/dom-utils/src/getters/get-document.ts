import { isDocument, isWindow } from "../predicates/index.js";

/** Returns the owner document for the given element, window, or node. */
export function getDocument(el: Element | Window | Node | Document | null | undefined) {
  if (isDocument(el)) return el;
  if (isWindow(el)) return el.document;
  return el?.ownerDocument ?? document;
}
