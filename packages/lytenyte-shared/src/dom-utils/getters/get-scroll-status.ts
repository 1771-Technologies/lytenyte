type ScrollStatus = "none" | "partial" | "full";
type ScrollTuple = [x: ScrollStatus, y: ScrollStatus];

function getAxisStatus(
  scrollPos: number,
  clientSize: number,
  scrollSize: number,
  epsilon = 1, // helps with sub-pixel / rounding differences
): ScrollStatus {
  const maxScroll = Math.max(0, scrollSize - clientSize);

  if (scrollPos <= epsilon) return "none";
  if (scrollPos >= maxScroll - epsilon) return "full";
  if (scrollPos >= epsilon) return "partial";
  return "partial";
}

/**
 * Returns scroll status tuple for [x, y]
 * - "no-scroll": content fits (no overflow)
 * - "partial": overflow exists and not fully scrolled to the end (includes top/left)
 * - "full-scrolled": overflow exists and scrolled to the end (right/bottom)
 */
export function getScrollStatus(el: HTMLElement, epsilon = 1): ScrollTuple {
  const x = getAxisStatus(el.scrollLeft, el.clientWidth, el.scrollWidth, epsilon);
  const y = getAxisStatus(el.scrollTop, el.clientHeight, el.scrollHeight, epsilon);
  return [x, y];
}
