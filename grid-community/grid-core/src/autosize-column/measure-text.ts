import { t } from "@1771technologies/grid-design";
const canvas = typeof OffscreenCanvas !== "undefined" ? document.createElement("canvas") : null;
const context = canvas ? canvas?.getContext("2d") : null;

export function measureText(text: string, el: HTMLElement) {
  if (!context) return 0;

  const style = getComputedStyle(el);
  const paddingValue = Number.parseInt(style.getPropertyValue(t.spacing.cell_horizontal_padding));
  const padding = Number.isNaN(paddingValue) ? 10 : paddingValue;

  const font = style.font;
  context.font = font;
  const measurement = context.measureText(text);

  return measurement.width + padding;
}
