import { getNearestFocusable } from "./getters/get-nearest-focusable.js";
import { getPositionFromFocusable } from "./getters/get-position-from-focusable.js";

export function ensureVisible(
  el: HTMLElement,
  scrollIntoView: (p: { row: number; column: number; behavior: "instant" }) => void,
) {
  const position = getPositionFromFocusable(getNearestFocusable(el)!);
  scrollIntoView({
    row: (position as any).rowIndex,
    column: position.colIndex,
    behavior: "instant",
  });
}
