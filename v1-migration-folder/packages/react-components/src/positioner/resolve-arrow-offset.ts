import type { Side } from "./use-positioner.js";

export function resolveArrowOffset(arrowElement: HTMLElement | null, side: Side) {
  if (!arrowElement) return 0;

  if (side === "bottom" || side === "top") {
    const height = arrowElement.offsetHeight;

    return height;
  }

  return arrowElement.offsetWidth;
}
