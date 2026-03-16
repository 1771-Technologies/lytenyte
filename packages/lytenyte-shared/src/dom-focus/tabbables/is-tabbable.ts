import { hasNegativeTabIndex } from "../../dom-utils/has-negative-tab-index.js";
import { isFocusable } from "../focusables/is-focusable.js";

/**
 * Determines whether an element participates in the sequential keyboard tab order.
 * An element is tabbable if it is not inside an inert subtree, has a positive tab
 * index, or is focusable and does not have a negative tab index.
 */
export function isTabbable(el: HTMLElement | null): el is HTMLElement {
  if (!el || el.closest("[inert]")) return false;
  if (el.tabIndex > 0) return true;
  return isFocusable(el) && !hasNegativeTabIndex(el);
}
