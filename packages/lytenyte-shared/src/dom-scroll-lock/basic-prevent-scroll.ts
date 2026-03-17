import { getDocument } from "../dom-utils/get-document.js";

export function basicPreventScroll(referenceElement: Element | null) {
  const doc = getDocument(referenceElement);
  const html = doc.documentElement;
  const originalOverflow = html.style.overflow;
  html.style.overflow = "hidden";
  return () => {
    html.style.overflow = originalOverflow;
  };
}
