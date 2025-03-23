import type { PointerEventHandler } from "react";
import { useCallback, useRef, useState } from "react";
import type { DragActive } from "./drag-store";
import { store } from "./drag-store";
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

  const onPointerDown: PointerEventHandler = useCallback(
    (ev) => {
      const startX = ev.clientX;
      const startY = ev.clientY;

      const c = new AbortController();

      let anim: number | null = null;
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
          if (!hasDragStartedRef.current) return;

          endDrag(ev.clientX, ev.clientY);
        },
        { signal: c.signal },
      );
      document.addEventListener(
        "pointercancel",
        (ev) => {
          c.abort();
          if (!hasDragStartedRef.current) return;

          endDrag(ev.clientX, ev.clientY, true);
        },
        { signal: c.signal },
      );
      document.addEventListener(
        "keydown",
        (ev) => {
          c.abort();
          if (!hasDragStartedRef.current) return;
          if (ev.key === "Escape") {
            const s = store.getState().active!;
            endDrag(s.x, s.y, true);
          }
        },
        { signal: c.signal },
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
    [getData, getTags, id, onDragCancel, onDragEnd, onDragMove, onDragStart],
  );

  return { onPointerDown, isActive };
}

function shouldDragStart(ev: PointerEvent, startX: number, startY: number) {
  // We don't want to immediately being dragging. We want to check if the current pointer
  // position is a specific distance from the start position. In this case we check if it
  // is at least 10px from the start position vertically or horizontally.
  const deltaY = Math.abs(ev.clientY - startY);
  const deltaX = Math.abs(ev.clientX - startX);

  return deltaX > 10 || deltaY > 10;
}
