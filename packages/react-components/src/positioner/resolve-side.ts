import type { Side } from "./use-positioner.js";

export function resolveSide(side: Side, isRtl: boolean) {
  if (side === "top" || side === "bottom") return side;

  if (isRtl) {
    return side === "start" ? "right" : "left";
  }
  return side === "start" ? "left" : "right";
}
