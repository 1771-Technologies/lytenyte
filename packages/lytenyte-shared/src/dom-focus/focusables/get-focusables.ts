import { isFrame } from "../../dom-utils/is-frame.js";
import { isHTMLElement } from "../../dom-utils/is-html-element.js";
import { focusableSelector } from "../constants.js";
import type { IncludeContainerType } from "../types.js";
import { isFocusable } from "./is-focusable.js";

/**
 * Returns all focusable elements within a container. Optionally includes the container
 * itself based on the `includeContainer` option. Elements within nested iframes are
 * also traversed and included.
 */
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

  const result: HTMLElement[] = [];
  for (const element of elements.filter(isFocusable)) {
    if (isFrame(element) && element.contentDocument) {
      result.push(...getFocusables(element.contentDocument.body));
    } else {
      result.push(element);
    }
  }

  return result;
};
