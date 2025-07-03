import { isRowsContainer } from "../predicates/is-row-container";
import { isRowsBottom } from "../predicates/is-rows-bottom";
import { isRowsTop } from "../predicates/is-rows-top";

export function getNearestRowSection(el?: HTMLElement) {
  if (el === undefined) el = document.activeElement as HTMLElement;

  if (!el) return null;

  let current: HTMLElement | null = el;
  while (current && !isRowsContainer(current)) {
    if (isRowsTop(current) || isRowsBottom(current) || isRowsTop(current)) return current;
    current = current.parentElement;
  }

  return null;
}
