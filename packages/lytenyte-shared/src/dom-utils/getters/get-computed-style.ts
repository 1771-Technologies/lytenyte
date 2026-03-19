import { getWindow } from "./get-window.js";

/** Returns the computed style of an element using its owning window. */
export function getComputedStyle(element: Element): CSSStyleDeclaration {
  return getWindow(element).getComputedStyle(element);
}
