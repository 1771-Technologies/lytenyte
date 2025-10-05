import { isDocument } from "./is-document.js";
import { isWindow } from "./is-window.js";

export function getDocument(el: Element | Window | Node | Document | null | undefined) {
  if (isDocument(el)) return el;
  if (isWindow(el)) return el.document;
  return el?.ownerDocument ?? document;
}
