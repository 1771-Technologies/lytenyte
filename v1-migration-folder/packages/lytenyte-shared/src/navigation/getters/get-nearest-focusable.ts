import { isCell } from "../predicates/is-cell";
import { isColumnGroupHeader } from "../predicates/is-column-group-header";
import { isColumnHeader } from "../predicates/is-column-header";
import { isRow } from "../predicates/is-row";
import { isViewport } from "../predicates/is-viewport";

export function getNearestFocusable(el?: HTMLElement) {
  if (!el) el = document.activeElement as HTMLElement;
  if (!el) return null;

  let current: HTMLElement | null = el;

  while (current && !isViewport(current)) {
    if (
      isColumnHeader(current) ||
      isColumnGroupHeader(current) ||
      isCell(current) ||
      (isRow(current) && current.getAttribute("data-ln-rowtype") === "full-width")
    ) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}
