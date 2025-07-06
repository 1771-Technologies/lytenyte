import { isHeaderRow } from "../predicates/is-header-row";
import { isViewport } from "../predicates/is-viewport";

export function getNearestHeaderRow(el?: HTMLElement) {
  if (!el) el = document.activeElement as HTMLElement;
  if (!el) return null;

  let current: HTMLElement | null = el;

  while (current && !isViewport(current)) {
    if (isHeaderRow(current)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}
