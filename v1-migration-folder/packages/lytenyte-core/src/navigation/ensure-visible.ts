import { getNearestFocusable } from "./getters/get-nearest-focusable";
import { getPositionFromFocusable } from "./getters/get-position-from-focusable";

export function ensureVisible(
  el: HTMLElement,
  scrollIntoView: (p: { row: number; column: number; behavior: "instant" }) => void,
) {
  const position = getPositionFromFocusable(getNearestFocusable(el)!);
  scrollIntoView({
    row: (position as any).rowIndex,
    column: position.columnIndex,
    behavior: "instant",
  });
}
