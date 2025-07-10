import { getWindow } from "./get-window.js";
import { hasWindow } from "./has-window.js";

export function isHTMLElement(value: unknown): value is HTMLElement {
  if (!hasWindow()) {
    return false;
  }

  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
