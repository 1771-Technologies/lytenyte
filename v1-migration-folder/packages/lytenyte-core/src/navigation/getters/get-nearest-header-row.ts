import { isHeader } from "../predicates/is-header";
import { isHeaderRow } from "../predicates/is-header-row";

export function getNearestHeaderRow(el?: HTMLElement) {
  if (el === undefined) el = document.activeElement as HTMLElement;

  if (!el) return null;

  let current: HTMLElement | null = el;
  while (current && !isHeader(current)) {
    if (isHeaderRow(current)) return current;
    current = current.parentElement;
  }

  return null;
}
