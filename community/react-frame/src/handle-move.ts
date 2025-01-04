import { clamp, getClientX, getClientY } from "@1771technologies/js-utils";
import type { RefObject } from "react";
import type { FrameAxeProps } from "./frame";

export function handleMove(
  el: PointerEvent,
  announcer: HTMLElement,
  axe: FrameAxeProps,
  ref: HTMLElement,
  raf: RefObject<number | null>,
  onMove: (x: number, h: number) => void,
  w: number,
  h: number,
  sizeSync: () => void,
) {
  el.preventDefault();
  let prevX = getClientX(el);
  let prevY = getClientY(el);

  const controller = new AbortController();
  const prevPointerEvents = ref!.style.pointerEvents;

  const t = setTimeout(() => {
    ref!.style.pointerEvents = "none";

    announcer.textContent = axe.axeMoveStartText(prevX, prevY);
    window.addEventListener(
      "pointermove",
      (el) => {
        if (raf.current) cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => {
          const currentX = getClientX(el);
          const currentY = getClientY(el);

          const deltaX = currentX - prevX;
          const deltaY = currentY - prevY;

          const s = getComputedStyle(ref!);
          const x = Number.parseInt(s.left);
          const y = Number.parseInt(s.top);

          const newX = clamp(0, x + deltaX, window.innerWidth - w!);
          const newY = clamp(0, y + deltaY, window.innerHeight - h!);

          Object.assign(ref!.style, { top: `${newY}px`, left: `${newX}px` });

          prevX = currentX;
          prevY = currentY;
        });
      },
      { signal: controller.signal },
    );
  }, 40);

  window.addEventListener("pointerup", () => {
    controller.abort();
    Object.assign(ref!.style, { pointerEvents: prevPointerEvents });

    const s = getComputedStyle(ref!);
    const x = Number.parseInt(s.left);
    const y = Number.parseInt(s.top);

    announcer.textContent = axe.axeMoveEndText(x, y);
    onMove?.(x, y);

    setTimeout(sizeSync);
    raf.current = null;
    clearTimeout(t);
  });
}
