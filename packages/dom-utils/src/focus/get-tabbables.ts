import { isFrame } from "../is-frame.js";
import { focusableSelector } from "./+constants.js";
import type { IncludeContainerType } from "./+types.js";
import { getTabIndex } from "./get-tab-index.js";
import { isTabbable } from "./is-tabbable.js";

export function getTabbables(
  container: HTMLElement | null,
  includeContainer?: IncludeContainerType,
) {
  if (!container) return [];
  const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
  const tabbableElements = elements.filter(isTabbable);

  if (includeContainer && isTabbable(container)) {
    tabbableElements.unshift(container);
  }

  tabbableElements.forEach((element, i) => {
    if (isFrame(element) && element.contentDocument) {
      const frameBody = element.contentDocument.body;
      const allFrameTabbable = getTabbables(frameBody);
      tabbableElements.splice(i, 1, ...allFrameTabbable);
    }
  });

  if (!tabbableElements.length && includeContainer) {
    return elements;
  }

  return tabbableElements.sort((l, r) => getTabIndex(r) - getTabIndex(l));
}
