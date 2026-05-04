import { getNearestMatching } from "@1771technologies/dom-utils";
import { isCell, isDetail, isFloatingCell, isFullWidth, isHeaderCell, isHeaderGroup } from "./predicates.js";

export function nearestFocusable(gridId: string, el: HTMLElement): HTMLElement | null {
  return getNearestMatching(el, (el) => {
    return (
      isCell(gridId, el) ||
      isDetail(gridId, el) ||
      isFullWidth(gridId, el) ||
      isHeaderCell(gridId, el) ||
      isHeaderGroup(gridId, el) ||
      isFloatingCell(gridId, el)
    );
  });
}
