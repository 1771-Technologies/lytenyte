const canvas = typeof OffscreenCanvas !== "undefined" ? document.createElement("canvas") : null;
const context = canvas ? canvas?.getContext("2d") : null;

export function measureText(text: string, el: HTMLElement) {
  if (!context) return 0;

  const style = getComputedStyle(el);
  const padding = 10;

  const font = style.font;
  context.font = font;
  const measurement = context.measureText(text);

  return measurement.width + padding;
}
