import { isElement } from "../platform/isElement.js";
import type { VirtualElement } from "../types.js";

export function unwrapElement(element: Element | VirtualElement) {
  return !isElement(element) ? element.contextElement : element;
}
