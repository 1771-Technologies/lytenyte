import type { GridSections } from "../../types.js";
import type { ForceSettings } from "./get-access-forcing.js";

/**
 * Returns the current access regions for the viewport scroll. This tells us if cells in a particular pin
 * area can be selected based on the viewport's scroll position.
 */
export function getRangeAccess(gridSections: GridSections, viewport: HTMLElement, force: ForceSettings) {
  const sl = Math.abs(viewport!.scrollLeft);
  const st = viewport!.scrollTop;
  const maxScrollX = viewport!.scrollWidth - viewport!.clientWidth;
  const maxScrollY = viewport!.scrollHeight - viewport!.clientHeight;
  return {
    startAccessible: force.start || gridSections.startCount === 0 || sl <= 1,
    endAccessible: force.end || gridSections.endCount === 0 || sl >= maxScrollX - 1,
    topAccessible: force.top || gridSections.topCount === 0 || st <= 1,
    bottomAccessible: force.bottom || gridSections.bottomCount === 0 || st >= maxScrollY - 1,
  };
}
