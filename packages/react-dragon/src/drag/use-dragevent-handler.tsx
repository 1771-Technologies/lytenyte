import {
  useCallback,
  type Dispatch,
  type DragEvent as ReactDragEvent,
  type SetStateAction,
} from "react";
import type { UseDraggableProps } from "../use-draggable";
import {
  activeDragElement,
  dragDataAtom,
  dragPositionAtom,
  dragStyleHandler,
  dropAtom,
  placeholderHandler,
  store,
} from "../+globals";
import { createRoot } from "react-dom/client";
import { resetDragState } from "../utils/reset-drag-state";
import { getFrameElement } from "@1771technologies/lytenyte-dom-utils";

export function useDragEventHandler(
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
) {
  const handleDragStart = useCallback(
    (ev: ReactDragEvent) => {
      const dragElement = ev.currentTarget as HTMLElement;
      const data = getItems(dragElement);

      if (data.dataTransfer) {
        Object.entries(data.dataTransfer).forEach((c) => {
          ev.dataTransfer.setData(c[0], c[1]);
        });
      }

      let frame: number | null = null;
      let [x, x1] = [ev.clientX, ev.clientX];
      let [y, y1] = [ev.clientY, ev.clientY];
      let prevX = ev.clientX;
      let prevY = ev.clientY;

      const frameEl = getFrameElement(window);

      setDragging(true);
      onDragStart?.({ dragElement, position: { x, y }, state: data });

      store.set(dragDataAtom, data);
      store.set(dropAtom, { current: onDrop ?? null });
      store.set(dragPositionAtom, { x, y });
      store.set(activeDragElement, dragElement);

      let placeholderElement: HTMLElement | null = null;
      if (placeholder) {
        const cr = document.createElement("div");
        cr.style.position = "fixed";
        cr.style.top = "-9999px";

        const root = createRoot(cr);
        root.render(<>{placeholder(data)}</>);

        placeholderElement = cr;
        document.body.append(placeholderElement);

        ev.dataTransfer.setDragImage(
          placeholderElement,
          placeholderOffset?.[0] ?? -10,
          placeholderOffset?.[1] ?? 10,
        );
      }

      const styleEl = document.createElement("style");

      dragStyleHandler.set(styleEl);
      placeholderHandler.set(placeholderElement);

      // We need to delay this in the event that the drag target is also in a drop target.
      setTimeout(() => {
        styleEl.innerHTML = `[data-ln-drop-zone="true"] :not([data-ln-drop-zone="true"]) { pointer-events: none; }`;
      }, 4);

      document.head.appendChild(styleEl);

      const controller = new AbortController();
      document.addEventListener(
        "drag",
        (ev) => {
          // We have queued an animation frame or the cursor pointer has not moved, then we can just return.
          if (frame || (prevX === ev.clientX && prevY === ev.clientY)) return;

          frame = requestAnimationFrame(() => {
            [x, x1] = [x1, ev.clientX];
            [y, y1] = [y1, ev.clientY];

            prevX = ev.clientX;
            prevY = ev.clientY;

            let xOffset = 0;
            let yOffset = 0;
            if (frameEl && ev.view !== window) {
              const bb = frameEl.getBoundingClientRect();
              xOffset = bb.x;
              yOffset = bb.y;
            }

            onDragMove?.({
              dragElement,
              position: { x: x - xOffset, y: y - yOffset },
              state: data,
            });
            store.set(dragPositionAtom, { x: x - xOffset, y: y - yOffset });

            frame = null;
          });
        },
        { signal: controller.signal },
      );

      document.addEventListener(
        "dragover",
        (e) => {
          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
        },
        { signal: controller.signal },
      );

      document.addEventListener(
        "drop",
        (e) => {
          e.preventDefault();
          placeholderHandler.clean();
          dragStyleHandler.clean();
        },
        { signal: controller.signal },
      );

      document.addEventListener("dragend", () => {}, { capture: true, signal: controller.signal });

      document.addEventListener(
        "dragend",
        () => {
          controller.abort();
          onDragEnd?.({ dragElement, position: store.get(dragPositionAtom)!, state: data });

          setDragging(false);
          resetDragState();

          placeholderHandler.clean();
          dragStyleHandler.clean();
        },
        { signal: controller.signal },
      );
    },
    [
      getItems,
      onDragEnd,
      onDragMove,
      onDragStart,
      onDrop,
      placeholder,
      placeholderOffset,
      setDragging,
    ],
  );

  return handleDragStart;
}
