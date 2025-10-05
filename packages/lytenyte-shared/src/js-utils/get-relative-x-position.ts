export function getRelativeXPosition(
  element: HTMLElement,
  mouseX: number,
): { left: number; right: number } {
  const rect = element.getBoundingClientRect();
  const computedStyled = getComputedStyle(element);

  const isRtl = computedStyled.direction === "rtl";

  const fromRightScrollbar = isRtl ? 0 : element.offsetWidth - element.clientWidth;
  const fromRightAdjusted = rect.right - fromRightScrollbar;
  const right = fromRightAdjusted - mouseX;

  const fromLeftScrollbar = isRtl ? element.offsetWidth - element.clientWidth : 0;
  const fromLeftAdjusted = rect.left + fromLeftScrollbar;
  const left = mouseX - fromLeftAdjusted;

  return { left, right };
}
