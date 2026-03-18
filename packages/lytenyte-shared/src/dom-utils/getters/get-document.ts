import { isDocument, isWindow } from "../predicates/index.js";

export function getDocument(el: Element | Window | Node | Document | null | undefined) {
  if (isDocument(el)) return el;
  if (isWindow(el)) return el.document;
  return el?.ownerDocument ?? document;
}
