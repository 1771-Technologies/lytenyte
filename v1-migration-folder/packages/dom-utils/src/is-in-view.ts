export function isInView(
  el: HTMLElement,
  bound: HTMLElement,
  offset?: { top?: number; left?: number; right?: number; bottom?: number },
): boolean {
  if (!el || !bound) return false;

  const elRect = el.getBoundingClientRect();
  const boundRect = bound.getBoundingClientRect();

  const topOffset = offset?.top ?? 0;
  const leftOffset = offset?.left ?? 0;
  const rightOffset = offset?.right ?? 0;
  const bottomOffset = offset?.bottom ?? 0;

  const isVisible =
    elRect.bottom <= boundRect.bottom - bottomOffset &&
    elRect.top >= boundRect.top + topOffset &&
    elRect.right <= boundRect.right - rightOffset &&
    elRect.left >= boundRect.left + leftOffset;

  return isVisible;
}
