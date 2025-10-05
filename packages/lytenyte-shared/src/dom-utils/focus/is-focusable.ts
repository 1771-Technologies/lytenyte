import { isElementVisible } from "../is-element-visible.js";
import { focusableSelector } from "./+constants.js";

export function isFocusable(element: HTMLElement | null): element is HTMLElement {
  if (!element || element.closest("[inert]")) return false;
  return element.matches(focusableSelector) && isElementVisible(element);
}
