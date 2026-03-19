import { getDocument } from "../dom-utils/getters/get-document.js";

/**
 * Prevents scrolling on the document by setting `overflow: hidden` on the
 * root element. Returns a cleanup function that restores the original overflow
 * value. Intended for iOS and environments without inset scrollbars where a
 * simpler lock strategy is sufficient.
 */
export function basicPreventScroll(referenceElement: Element | null) {
  const doc = getDocument(referenceElement);
  const html = doc.documentElement;
  const originalOverflow = html.style.overflow;
  html.style.overflow = "hidden";
  return () => {
    html.style.overflow = originalOverflow;
  };
}
