import type { VirtualTarget } from "../types";

export function virtualFromXY(x: number, y: number, context?: HTMLElement): VirtualTarget {
  return {
    contextElement: context,
    getBoundingClientRect: () => ({
      bottom: y,
      left: x,
      height: 0,
      right: x,
      top: y,
      width: 0,
      x,
      y,
    }),
  };
}
