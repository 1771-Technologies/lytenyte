import { getDocument } from "./get-document.js";

export function getDocumentElement(
  el: Element | Node | Window | Document | null | undefined,
): HTMLElement {
  return getDocument(el).documentElement;
}
