import { isCell } from "./is-cell";
import { isFullWidthRow } from "./is-full-width-row";
import { isHeaderCell } from "./is-header-cell";

export function isFocusable(el: HTMLElement | null) {
  return el && (isCell(el) || isHeaderCell(el) || isFullWidthRow(el));
}
