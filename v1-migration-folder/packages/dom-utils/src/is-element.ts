import { getWindow } from "./get-window.js";
import { hasWindow } from "./has-window.js";

export function isElement(value: unknown): value is Element {
  if (!hasWindow()) {
    return false;
  }

  return value instanceof Element || value instanceof getWindow(value).Element;
}
