import { getFrameElement } from "@1771technologies/lytenyte-shared";
import { useLayoutEffect, useRef } from "react";

export function useMoveFlip(el: HTMLElement | null, position: number) {
  const bb = useRef<DOMRect | null>(null);
  useLayoutEffect(() => {
    if (!el) return;

    const frameEl = getFrameElement(window);

    if (!bb.current) {
      setTimeout(
        () => {
          requestAnimationFrame(() => {
            bb.current = el.getBoundingClientRect();
          });
        },
        frameEl ? 200 : 0,
      );
      return;
    }

    const next = el.getBoundingClientRect();
    const prev = bb.current!;

    const delta = prev.left - next.left;
    bb.current = next;

    requestAnimationFrame(() => {
      el.style.transition = `transform 0s`;
      el.style.transform = `translate3d(${delta}px, 0px, 0px)`;

      requestAnimationFrame(() => {
        el.style.transition = `transform 100ms linear`;
        el.style.transform = "";
      });
    });
  }, [el, position]);
}
