import { focusableSelector } from "../constants.js";

/**
 * Determines whether an element is focusable. An element is considered focusable if it
 * matches the focusable selector, is not inside an inert subtree, and has a non-zero
 * rendered size or at least one client rect.
 */
export function isFocusable(el: HTMLElement | null): el is HTMLElement {
  if (!el || el.closest("[inert]")) return false;
  return (
    el.matches(focusableSelector) &&
    (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0)
  );
}
