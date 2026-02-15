import { isHTMLElement } from "../dom-utils/index.js";

let canvas: null | HTMLCanvasElement = null;
let context: null | CanvasRenderingContext2D = null;

export function measureText(
  text: string,
  reference?: HTMLElement | string | undefined | null,
): TextMetrics | null {
  if (typeof document === "undefined") return null;

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "-9999px";
    canvas.role = "none";
    context = canvas.getContext("2d")!;
    document.body.appendChild(canvas);
  }

  let font: string;
  if (typeof reference === "string") font = reference;
  else if (isHTMLElement(reference)) {
    const style = getComputedStyle(reference);
    font = style.font;
  } else {
    const style = getComputedStyle(document.body);
    font = style.font;
  }

  context!.font = font;
  const measurement = context!.measureText(text);

  return measurement;
}
