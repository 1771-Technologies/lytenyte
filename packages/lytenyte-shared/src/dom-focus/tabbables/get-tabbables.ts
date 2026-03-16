import { isFrame } from "../../dom-utils/is-frame.js";
import { focusableSelector } from "../constants.js";
import type { IncludeContainerType } from "../types.js";
import { getTabIndex } from "./get-tab-index.js";
import { isTabbable } from "./is-tabbable.js";

/**
 * Returns all tabbable elements within a container, sorted in tab order: elements
 * with a positive tab index appear first in ascending order, followed by elements
 * with a tab index of zero. Optionally includes the container itself based on the
 * `includeContainer` option. Elements within nested iframes are also traversed and
 * included.
 */
export function getTabbables(container: HTMLElement | null, includeContainer?: IncludeContainerType) {
  if (!container) return [];
  const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
  const tabbableElements = elements.filter(isTabbable);

  if (includeContainer && isTabbable(container)) {
    tabbableElements.unshift(container);
  }

  const result: HTMLElement[] = [];
  for (const element of tabbableElements) {
    if (isFrame(element) && element.contentDocument) {
      result.push(...getTabbables(element.contentDocument.body));
    } else {
      result.push(element);
    }
  }

  return result.sort((l, r) => {
    const lIdx = getTabIndex(l);
    const rIdx = getTabIndex(r);
    if (lIdx === 0 && rIdx === 0) return 0;
    if (lIdx === 0) return 1;
    if (rIdx === 0) return -1;
    return lIdx - rIdx;
  });
}
