import { hasNegativeTabIndex } from "../has-negative-tab-index.js";
import { isFocusable } from "./is-focusable.js";

export function isTabbable(el: HTMLElement | null): el is HTMLElement {
  if (el != null && el.tabIndex > 0) return true;
  return isFocusable(el) && !hasNegativeTabIndex(el);
}
