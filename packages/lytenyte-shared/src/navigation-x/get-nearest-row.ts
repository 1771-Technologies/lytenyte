import { isRow, isViewport } from "./predicates.js";

export function getNearestRow(gridId: string, el?: HTMLElement) {
  if (!el) el = document.activeElement as HTMLElement;
  if (!el) return null;

  let current: HTMLElement | null = el;

  while (current && !isViewport(gridId, current)) {
    if (isRow(gridId, current)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}
