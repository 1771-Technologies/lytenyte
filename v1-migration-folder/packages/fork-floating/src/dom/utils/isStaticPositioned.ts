import { getComputedStyle } from "../../utils/dom.js";

export function isStaticPositioned(element: Element): boolean {
  return getComputedStyle(element).position === "static";
}
