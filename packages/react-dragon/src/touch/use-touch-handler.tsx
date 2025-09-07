import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { UseDraggableProps } from "../use-draggable";
import { makeLongTouchPressHandler } from "@1771technologies/lytenyte-dom-utils";
import {
  activeDragElement,
  activeDropAtom,
  dragDataAtom,
  dragPositionAtom,
  dropAtom,
  dropZonesAtom,
  isTouchDragAtom,
  store,
} from "../+globals.js";
import { useAutoScroll } from "../auto-scroll/use-autoscroll.js";
import { makePlaceholder } from "./make-placeholder.js";
import { resetDragState } from "../utils/reset-drag-state.js";

export function useTouchHandler(
  {
    getItems,
    onDragEnd,
    onDragMove,
    onDragStart,
    onDrop,
    placeholder,
    placeholderOffset,
  }: UseDraggableProps,
  setDragging: Dispatch<SetStateAction<boolean>>,
  dragElement: HTMLElement | null,
) {
  useAutoScroll();
  useEffect(() => {
    if (!dragElement) return;

    const fn = makeLongTouchPressHandler((ev) => {
      const data = getItems(dragElement as HTMLElement);

      const offX = placeholderOffset?.[0] ?? 0;
      const offY = placeholderOffset?.[1] ?? 0;

      setDragging(true);

      const x = ev.touches[0].clientX;
      const y = ev.touches[0].clientY;

      store.set(isTouchDragAtom, true);
      store.set(dragDataAtom, data);
      /* v8 ignore next 1 */
      store.set(dropAtom, { current: onDrop ?? null });
      store.set(dragPositionAtom, { x, y });
      store.set(activeDragElement, dragElement);

      onDragStart?.({ dragElement, position: { x, y }, state: data });

      const placeholderElement = makePlaceholder(placeholder, dragElement, data, x, y, offX, offY);

      const controller = new AbortController();
      let frame: number | null = null;
      document.addEventListener(
        "touchmove",
        (ev) => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            const x = ev.touches[0].clientX;
            const y = ev.touches[0].clientY;

            onDragMove?.({ dragElement, position: { x, y }, state: data });
            store.set(dragPositionAtom, { x, y });

            placeholderElement.style.top = `${y + offY}px`;
            placeholderElement.style.left = `${x + offX}px`;

            frame = null;

            const elements = document.elementsFromPoint(x, y) as HTMLElement[];
            const active = store.get(activeDropAtom);

            for (let i = 0; i < elements.length; i++) {
              const el = elements[i];
              const dropZone = dropZonesAtom.get(el);

              // We have found a drop and its not equal to our current one
              if (dropZone && active !== el) {
                // We definitely want to leave our current active, since we have a new active one.
                /* v8 ignore next 1 */
                if (active) dropZonesAtom.get(active)?.leave(active);

                let j = 0;
                while (j < i) {
                  const potentialChild = elements[j];
                  /* v8 ignore next 4 */
                  if (!el.contains(potentialChild)) {
                    store.set(activeDropAtom, null);
                    return;
                  }
                  j++;
                }

                store.set(activeDropAtom, el);
                dropZone.enter(el);

                return;
                /* v8 ignore next 18 */
              } else if (active === el) {
                let j = 0;
                while (j < i) {
                  const potentialChild = elements[j];
                  // The element is not a child of the current active dropzone. This means it is
                  // covered by another element. In this case we need to actually remove the drop
                  // zone.
                  if (!active.contains(potentialChild)) {
                    dropZonesAtom.get(active)?.leave(active);
                    store.set(activeDropAtom, null);
                    return;
                  }
                  j++;
                }
                // We are over our current drop zone still, so nothing to do
                return;
              }
            }

            // If we reach this point, that means we are no longer over a drop zone that we have
            // registered. So we need to remove our active node if we have one.
            if (active) {
              dropZonesAtom.get(active)?.leave(active);
              store.set(activeDropAtom, null);
            }
          });
        },
        { signal: controller.signal },
      );

      document.addEventListener(
        "touchend",
        (ev) => {
          ev.preventDefault();

          controller.abort();
          const pos = store.get(dragPositionAtom)!;
          onDragEnd?.({ dragElement, position: pos, state: data });

          const drop = dropZonesAtom.get(store.get(activeDropAtom)!);
          drop?.drop?.();

          setDragging(false);
          resetDragState();

          placeholderElement?.remove();
        },
        { signal: controller.signal },
      );
      document.addEventListener(
        "touchcancel",
        (ev) => {
          ev.preventDefault();

          controller.abort();

          const drop = dropZonesAtom.get(store.get(activeDropAtom)!);
          drop?.drop?.();

          setDragging(false);
          resetDragState();
          placeholderElement?.remove();
        },
        { signal: controller.signal },
      );
    }, 300);

    dragElement.addEventListener("touchstart", fn, { passive: false });

    return () => {
      dragElement.removeEventListener("touchstart", fn);
    };
  }, [
    dragElement,
    getItems,
    onDragEnd,
    onDragMove,
    onDragStart,
    onDrop,
    placeholder,
    placeholderOffset,
    setDragging,
  ]);
}
