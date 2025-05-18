import { useEffect, useRef, useState } from "react";
import type { DragActive } from "./drag-store";
import { useDragStore } from "./drag-store";
import { computeActiveDrag } from "./compute-active-drag";

export interface UseDraggableArgs {
  readonly id: string;
  readonly getTags: () => string[];
  readonly getData: () => unknown;

  readonly onDragStart?: (p: DragActive) => void;
  readonly onDragMove?: (p: DragActive) => void;
  readonly onDragEnd?: (p: DragActive) => void;
  readonly onDragCancel?: (p: DragActive) => void;
}

export function useDraggable({
  id,
  getTags,
  getData,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDragCancel,
}: UseDraggableArgs) {
  const hasDragStartedRef = useRef(false);
  const [isActive, setIsActive] = useState(false);

  const store = useDragStore();

  const [drag, setDrag] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!drag) return;

    const c = new AbortController();

    drag.addEventListener(
      "touchstart",
      (ev) => {
        ev.preventDefault();
      },
      { passive: false, signal: c.signal },
    );

    drag.addEventListener(
      "pointerdown",
      (ev) => {
        const startX = ev.clientX;
        const startY = ev.clientY;

        if (ev.pointerType === "touch") {
          hasDragStartedRef.current = true;

          const data = getData();
          const tags = getTags();

          const s = store.getState();
          const next = computeActiveDrag(s.mounted, tags, data, id, startX, startY);

          store.setState({ active: next });
          onDragStart?.(next);
          setIsActive(true);

          ev.stopPropagation();
          ev.preventDefault();
        }

        // If we are using a mouse we should press the left click
        if (ev.pointerType === "mouse" && ev.button !== 0) return;

        const c = new AbortController();

        let anim: number | null = null;

        // This is a stupid hack, but it seems to work. Sometimes the drag handle is within a clickable element.
        // For some reason the click will still fire if the cursor is moved over the element and released. We
        // prevent this here by just blocking all clicks whilst a drag is active. Furthermore for some reason
        // remove the listener with an abort controller is insufficient, hence we use the removeEventListener
        // method here. All said this is an ugly hack but it seams to work so hey - maybe one day the browser
        // will provide a decent drag and drop api.
        const clickFix = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();
          globalThis.removeEventListener("click", clickFix, { capture: true });
        };
        globalThis.addEventListener("click", clickFix, { capture: true });

        document.addEventListener(
          "pointermove",
          (ev) => {
            if (!hasDragStartedRef.current && !shouldDragStart(ev, startX, startY)) return;

            const x = ev.clientX;
            const y = ev.clientY;

            if (!hasDragStartedRef.current) {
              hasDragStartedRef.current = true;

              const data = getData();
              const tags = getTags();

              const s = store.getState();
              const next = computeActiveDrag(s.mounted, tags, data, id, x, y);

              store.setState({ active: next });
              onDragStart?.(next);
              setIsActive(true);
            }

            if (anim) return;
            anim = requestAnimationFrame(() => {
              const s = store.getState();
              const data = s.active!.data;
              const tags = s.active!.tags;

              const next = computeActiveDrag(s.mounted, tags, data, id, x, y);
              store.setState({ active: next });
              onDragMove?.(next);
              anim = null;
            });
          },
          { signal: c.signal },
        );

        document.addEventListener(
          "pointerup",
          (ev) => {
            c.abort();
            setTimeout(() => globalThis.removeEventListener("click", clickFix, { capture: true }));

            if (!hasDragStartedRef.current) return;

            endDrag(ev.clientX, ev.clientY);
          },
          { signal: c.signal, capture: true },
        );
        document.addEventListener(
          "pointercancel",
          (ev) => {
            c.abort();
            setTimeout(() => globalThis.removeEventListener("click", clickFix, { capture: true }));

            if (!hasDragStartedRef.current) return;

            endDrag(ev.clientX, ev.clientY, true);
          },
          { signal: c.signal },
        );
        document.addEventListener(
          "keydown",
          (ev) => {
            c.abort();
            setTimeout(() => globalThis.removeEventListener("click", clickFix, { capture: true }));

            if (!hasDragStartedRef.current) return;
            if (ev.key === "Escape") {
              // Stop the escape from doing anything else
              ev.preventDefault();
              ev.stopPropagation();
              const s = store.getState().active!;
              endDrag(s.x, s.y, true);
            }
          },
          { signal: c.signal, capture: true },
        );

        function endDrag(x: number, y: number, isCancel = false) {
          const s = store.getState();
          setIsActive(false);

          const next = computeActiveDrag(
            s.mounted,
            s.active!.tags,
            s.active!.data,
            s.active!.id,
            x,
            y,
          );

          if (isCancel) {
            onDragCancel?.(next);
          } else {
            onDragEnd?.(next);
          }

          hasDragStartedRef.current = false;
          store.setState({ active: null });
        }
      },
      { passive: false, signal: c.signal },
    );

    return () => c.abort();
  }, [drag, getData, getTags, id, onDragCancel, onDragEnd, onDragMove, onDragStart, store]);

  return { setDrag, isActive };
}

function shouldDragStart(ev: PointerEvent, startX: number, startY: number) {
  // We don't want to immediately being dragging. We want to check if the current pointer
  // position is a specific distance from the start position. In this case we check if it
  // is at least 10px from the start position vertically or horizontally.
  const deltaY = Math.abs(ev.clientY - startY);
  const deltaX = Math.abs(ev.clientX - startX);

  return deltaX > 10 || deltaY > 10;
}
