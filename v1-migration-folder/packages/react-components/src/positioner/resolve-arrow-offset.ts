import type { Side } from "./use-positioner.js";

export function resolveArrowOffset(arrowElement: HTMLElement | null, side: Side) {
  if (!arrowElement) return 0;

  const bb = arrowElement.getBoundingClientRect();
  return side === "bottom" || side === "top" ? bb.height : bb.width;
}
