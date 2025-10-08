import { isRow } from "../predicates/is-row.js";
import { isViewport } from "../predicates/is-viewport.js";

export function getNearestRow(gridId: string, el?: HTMLElement) {
  if (!el) el = document.activeElement as HTMLElement;
  if (!el) return null;

  let current: HTMLElement | null = el;

  while (current && !isViewport(current, gridId)) {
    if (isRow(current, gridId)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}
