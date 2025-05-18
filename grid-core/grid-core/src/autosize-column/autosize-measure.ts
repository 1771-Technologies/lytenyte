import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

const canvas = typeof OffscreenCanvas !== "undefined" ? document.createElement("canvas") : null;
const context = canvas ? canvas?.getContext("2d") : null;

export function autosizeMeasure<D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
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
