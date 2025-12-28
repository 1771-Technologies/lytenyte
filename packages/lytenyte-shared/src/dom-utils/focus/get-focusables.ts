import { isFrame } from "../is-frame.js";
import { isHTMLElement } from "../is-html-element.js";
import { focusableSelector } from "./+constants.js";
import type { IncludeContainerType } from "./+types.js";
import { isFocusable } from "./is-focusable.js";

export const getFocusables = (
  container: Pick<HTMLElement, "querySelectorAll"> | null,
  includeContainer: IncludeContainerType = false,
) => {
  if (!container) return [];
  const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));

  const include = includeContainer == true || (includeContainer == "if-empty" && elements.length === 0);
  if (include && isHTMLElement(container) && isFocusable(container)) {
    elements.unshift(container);
  }

  const focusableElements = elements.filter(isFocusable);

  focusableElements.forEach((element, i) => {
    if (isFrame(element) && element.contentDocument) {
      const frameBody = element.contentDocument.body;
      focusableElements.splice(i, 1, ...getFocusables(frameBody));
    }
  });

  return focusableElements;
};
