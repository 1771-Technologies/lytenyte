import { getClientX, getClientY } from "@1771technologies/js-utils";
import type { FrameAxeProps } from "./frame";

export function handleResize(
  el: PointerEvent,
  announcer: HTMLDivElement,
  axe: FrameAxeProps,
  x: number,
  y: number,
  w: number,
  h: number,
  ref: HTMLElement,
  sizeChange: (w: number, h: number) => void,
  sizeSync: () => void,
) {
  const startX = getClientX(el);
  const startY = getClientY(el);

  announcer.textContent = axe.axeResizeStartText(w, h);

  const controller = new AbortController();
  window.addEventListener(
    "pointermove",
    (ev) => {
      const currentX = getClientX(ev);
      const currentY = getClientY(ev);
      const xDelta = currentX - startX;
      const yDelta = currentY - startY;

      const maxWidth = window.innerWidth - x;
      const maxHeight = window.innerHeight - y;

      const newWidth = Math.min(w! + xDelta, maxWidth);
      const newHeight = Math.min(h! + yDelta, maxHeight);

      Object.assign(ref!.style, { width: `${newWidth}px`, height: `${newHeight}px` });
    },
    { signal: controller.signal },
  );
  window.addEventListener(
    "pointerup",
    () => {
      const bb = ref!.getBoundingClientRect();

      sizeChange(bb.width, bb.height);
      setTimeout(sizeSync);

      announcer.textContent = axe.axeResizeEndText(w, h);
      controller.abort();
    },
    { signal: controller.signal },
  );
}
