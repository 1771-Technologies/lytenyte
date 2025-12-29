export function getRelativeYPosition(element: HTMLElement, mouseY: number): { top: number; bot: number } {
  const rect = element.getBoundingClientRect();

  const scrollbarHeight = element.offsetHeight - element.clientHeight;
  const adjustedBottom = rect.bottom - scrollbarHeight;

  const bot = adjustedBottom - mouseY;
  const top = mouseY - rect.top;

  return { top, bot };
}
