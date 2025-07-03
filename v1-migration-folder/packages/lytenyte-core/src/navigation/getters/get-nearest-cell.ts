import { isCell } from "../predicates/is-cell";
import { isViewport } from "../predicates/is-viewport";

export function getNearestCell(el?: HTMLElement) {
  if (el === undefined) el = document.activeElement as HTMLElement;

  if (!el) return null;

  let current: HTMLElement | null = el;
  while (current && !isViewport(current)) {
    if (isCell(current)) return current;
    current = current.parentElement;
  }

  return null;
}
