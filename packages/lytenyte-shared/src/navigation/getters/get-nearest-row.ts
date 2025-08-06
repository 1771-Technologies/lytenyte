import { isRow } from "../predicates/is-row";
import { isViewport } from "../predicates/is-viewport";

export function getNearestRow(el?: HTMLElement) {
  if (!el) el = document.activeElement as HTMLElement;
  if (!el) return null;

  let current: HTMLElement | null = el;

  while (current && !isViewport(current)) {
    if (isRow(current)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}
