import { getDocument } from "../getters/get-document.js";
import { getWindow } from "../getters/get-window.js";

/**
 * Returns true if the document has inset (overlay) scrollbars, detected by
 * comparing the window's inner width against the document's client width.
 * Inset scrollbars sit on top of content and do not consume layout space.
 */
export function hasInsetScrollbars(referenceElement: Element | null) {
  const doc = getDocument(referenceElement);
  const win = getWindow(doc);

  return win.innerWidth - doc.documentElement.clientWidth > 0;
}
