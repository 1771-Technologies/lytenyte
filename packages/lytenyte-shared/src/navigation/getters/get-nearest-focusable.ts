import { isCell } from "../predicates/is-cell.js";
import { isColumnGroupHeader } from "../predicates/is-column-group-header.js";
import { isColumnHeader } from "../predicates/is-column-header.js";
import { isRow } from "../predicates/is-row.js";
import { isViewport } from "../predicates/is-viewport.js";

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
