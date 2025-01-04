import { getOwningGlobalThis } from "./get-owning-global-this.js";

/**
 * Calculates the width of the scrollbar for the window that owns the given element,
 * accounting for any margins on the body element.
 *
 * @param el - The HTML element whose owning window's scrollbar width should be calculated
 * @returns The width of the scrollbar in pixels
 *
 * @remarks
 * This function calculates the scrollbar width by comparing the window's inner width
 * with the body's total width including margins. It uses getComputedStyle to account
 * for both explicit margins and those from CSS stylesheets.
 *
 * @example
 * ```typescript
 * const div = document.createElement('div');
 * const scrollbarWidth = getOwnerScrollbarWidth(div);
 * console.log(`Scrollbar width: ${scrollbarWidth}px`);
 * ```
 */
export function getOwnerScrollbarWidth(el: HTMLElement): number {
  const owner = getOwningGlobalThis(el);

  const body = owner.document.body;
  const style = owner.getComputedStyle(body);
  const marginLeft = parseInt(style.marginLeft, 10);
  const marginRight = parseInt(style.marginRight, 10);

  return owner.innerWidth - (body.offsetWidth + marginLeft + marginRight);
}
