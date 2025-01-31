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
export function getOwnerScrollbarWidth(): number {
  return getScrollbarWidth();
  // const owner = getOwningGlobalThis(el);

  // const body = owner.document.body;
  // const style = owner.getComputedStyle(body);
  // const marginLeft = parseInt(style.marginLeft, 10);
  // const marginRight = parseInt(style.marginRight, 10);

  // return owner.innerWidth - (body.offsetWidth + marginLeft + marginRight);
}

// https://stackoverflow.com/a/13382873
function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll"; // forcing scrollbar to appear
  // @ts-expect-error its fine, just a we fille
  outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement("div");
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Removing temporary elements from the DOM
  outer?.parentNode?.removeChild(outer);

  return scrollbarWidth;
}
