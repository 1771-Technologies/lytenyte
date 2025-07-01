import { getComputedStyle } from "../../utils/dom.js";

export function isRTL(element: Element) {
  return getComputedStyle(element).direction === "rtl";
}
