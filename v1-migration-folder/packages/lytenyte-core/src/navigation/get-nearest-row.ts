import { isRow } from "./predicates/is-row";
import { isRowsContainer } from "./predicates/is-row-container";

export function getNearestRow(el?: HTMLElement) {
  if (el === undefined) el = document.activeElement as HTMLElement;

  if (!el) return null;

  let current: HTMLElement | null = el;
  while (current && !isRowsContainer(current)) {
    if (isRow(current)) return current;
    current = current.parentElement;
  }

  return null;
}
