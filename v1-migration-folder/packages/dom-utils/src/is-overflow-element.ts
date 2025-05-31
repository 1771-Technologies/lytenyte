export function isOverflowElement(element: Element): boolean {
  const { overflow, overflowX, overflowY, display } = getComputedStyle(element);
  return (
    /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) &&
    !["inline", "contents"].includes(display)
  );
}
