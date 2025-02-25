import { getWindow } from "./get-window";
import { hasWindow } from "./has-window";

export function isNode(value: unknown): value is Node {
  if (!hasWindow()) {
    return false;
  }

  return value instanceof Node || value instanceof getWindow(value).Node;
}
