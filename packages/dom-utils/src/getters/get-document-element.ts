import { getDocument } from "./get-document.js";

/** Returns the document element (the html element) for the given node. */
export function getDocumentElement(el: Element | Node | Window | Document | null | undefined): HTMLElement {
  return getDocument(el).documentElement;
}
