import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

const canvas = typeof OffscreenCanvas !== "undefined" ? document.createElement("canvas") : null;
const context = canvas ? canvas?.getContext("2d") : null;

export function autosizeMeasure<D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  text: string,
  fontOverride?: string,
) {
  if (!context) return null;

  let font: string;
  if (!fontOverride) {
    const el = api.getState().internal.viewport.peek() ?? document.body;

    const style = getComputedStyle(el);

    font = style.font;
  } else {
    font = fontOverride;
  }

  context.font = font;
  const measurement = context.measureText(text);

  return measurement;
}
