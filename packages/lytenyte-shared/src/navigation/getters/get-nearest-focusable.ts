import { isCell } from "../predicates/is-cell.js";
import { isColumnGroupHeader } from "../predicates/is-column-group-header.js";
import { isColumnHeader } from "../predicates/is-column-header.js";
import { isDetailCell } from "../predicates/is-detail-cell.js";
import { isRow } from "../predicates/is-row.js";
import { isViewport } from "../predicates/is-viewport.js";

export function getNearestFocusable(gridId: string, el?: HTMLElement) {
  if (!el) el = document.activeElement as HTMLElement;
  if (!el) return null;

  let current: HTMLElement | null = el;

  while (current && !isViewport(current, gridId)) {
    if (
      isColumnHeader(current, gridId) ||
      isColumnGroupHeader(current, gridId) ||
      isCell(current, gridId) ||
      isDetailCell(current, gridId) ||
      (isRow(current, gridId) && current.getAttribute("data-ln-rowtype") === "full-width")
    ) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}
