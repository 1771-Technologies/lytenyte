import { getWindow } from "./get-window.js";
import { hasWindow } from "./has-window.js";

export function isShadowRoot(value: unknown): value is ShadowRoot {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }

  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
