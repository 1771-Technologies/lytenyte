import { getDocument } from "../dom-utils/get-document.js";
import { getWindow } from "../dom-utils/get-window.js";

export function hasInsetScrollbars(referenceElement: Element | null) {
  const doc = getDocument(referenceElement);
  const win = getWindow(doc);

  return win.innerWidth - doc.documentElement.clientWidth > 0;
}
