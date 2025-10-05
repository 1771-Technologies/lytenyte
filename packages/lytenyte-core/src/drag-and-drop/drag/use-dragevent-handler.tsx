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
} from "../+globals.js";
import { resetDragState } from "../utils/reset-drag-state.js";
import { getFrameElement, isFirefox } from "@1771technologies/lytenyte-dom-utils";
import { peek } from "@1771technologies/lytenyte-signal";

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
    (sEv: ReactDragEvent) => {
      const dragElement = sEv.currentTarget as HTMLElement;
      const data = getItems(dragElement);

      const ff = isFirefox();

      sEv.dataTransfer.setData("__ignore__", "");
      if (data.dataTransfer) {
        Object.entries(data.dataTransfer).forEach((c) => {
          sEv.dataTransfer.setData(c[0], c[1]);
        });
      }

      let frame: number | null = null;
      let [x, x1] = [sEv.clientX, sEv.clientX];
      let [y, y1] = [sEv.clientY, sEv.clientY];
      let prevX = sEv.clientX;
      let prevY = sEv.clientY;

      const frameEl = getFrameElement(window);

      setDragging(true);
      onDragStart?.({ dragElement, position: { x, y }, state: data });

      dragDataAtom.set(data);
      dropAtom.set({ current: onDrop ?? null });
      dragPositionAtom.set({ x, y });
      activeDragElement.set(dragElement);

      if (placeholder) {
        const placeholderElement = placeholder(data, dragElement);

        sEv.dataTransfer.setDragImage(
          placeholderElement,
          placeholderOffset?.[0] ?? -10,
          placeholderOffset?.[1] ?? 10,
        );
      }

      const styleEl = document.createElement("style");

      dragStyleHandler.set(styleEl);

      // We need to delay this in the event that the drag target is also in a drop target.
      setTimeout(() => {
        styleEl.innerHTML = `[data-ln-drop-zone="true"] :not([data-ln-drop-zone="true"]) { pointer-events: none; }`;
      }, 4);

      document.head.appendChild(styleEl);

      const handleDrag = (ev: DragEvent) => {
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
          dragPositionAtom.set({ x: x - xOffset, y: y - yOffset });

          frame = null;
        });
      };

      const controller = new AbortController();
      document.addEventListener(
        "drag",
        (ev) => {
          if (ff) return;
          handleDrag(ev);
        },
        { signal: controller.signal },
      );

      document.addEventListener(
        "dragover",
        (e) => {
          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
          if (ff) handleDrag(e);
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
          onDragEnd?.({ dragElement, position: peek(dragPositionAtom)!, state: data });

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
