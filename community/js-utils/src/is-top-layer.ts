export function isTopLayer(element: Element): boolean {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch {
      return false;
    }
  });
}
