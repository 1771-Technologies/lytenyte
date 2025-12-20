import type { DragEventHandler } from "react";
import { useMemo, useState } from "react";
import type { UseDraggableProps } from "./types.js";
import { getFrameElement, isFirefox } from "@1771technologies/lytenyte-shared";
import {
  clearDragGlobals,
  dragActiveDrop,
  dragBlankEl,
  dragData,
  dragStyleEl,
  dragX,
  dragY,
} from "./global.js";
import { ReactPlaceholder } from "./react-placeholder.js";

export function useDraggable({
  data,
  placeholder,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDrop,
}: UseDraggableProps) {
  const [dragging, setDragging] = useState(false);

  const props = useMemo(() => {
    const dataValues = Object.values(data);
    if (!dataValues.length) return {};

    const handleDrag: DragEventHandler = (startEvent) => {
      const ff = isFirefox();

      const dataTransfer = startEvent.dataTransfer;
      dataTransfer.setData("__ignore__", ""); // Allow drag on safari
      dataValues.forEach((x) => {
        if (x.kind === "site") return;
        if (x.kind === "dt") dataTransfer.setData(x.type, x.data);
      });

      let frame: number | null = null;
      let [x, x1] = [startEvent.clientX, startEvent.clientX];
      let [y, y1] = [startEvent.clientY, startEvent.clientY];
      let prevX = startEvent.clientX;
      let prevY = startEvent.clientY;

      setDragging(true);
      onDragStart?.({ data, ev: startEvent.nativeEvent, position: { x, y } });

      dragX(x);
      dragY(y);
      dragData(data);
      dragActiveDrop(onDrop ?? null);

      const frameEl = getFrameElement(window);

      if (typeof placeholder === "string" || (typeof placeholder === "object" && placeholder)) {
        const pl = typeof placeholder === "string" ? { query: placeholder } : placeholder;

        const element = document.querySelector(pl.query) as HTMLElement | null;
        if (element) {
          const offsetX = pl.offset?.[0] ?? -10;
          const offsetY = pl.offset?.[1] ?? 10;
          dataTransfer.setDragImage(element, offsetX, offsetY);
        }
      } else if (placeholder === null || typeof placeholder === "function") {
        const el = document.createElement("div");
        el.style.width = "1px";
        el.style.height = "1px";
        document.body.appendChild(el);

        dataTransfer.setDragImage(el, 0, 0);
        dragBlankEl(el);
      }

      const styleEl = document.createElement("style");
      dragStyleEl(styleEl);

      // We need to delay this in the event that the drag target is also in a drop target.
      setTimeout(() => {
        styleEl.innerHTML = `
            [data-ln-drop-zone="true"] :not([data-ln-drop-zone="true"]) { 
                pointer-events: none;
            }`;
      }, 4);
      document.head.appendChild(styleEl);

      const handleDrag = (ev: DragEvent) => {
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

          onDragMove?.({ data, ev, position: { x: x - xOffset, y: y - yOffset } });
          dragX(x - xOffset);
          dragY(y - yOffset);

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

          clearDragGlobals();
        },
        { signal: controller.signal },
      );

      document.addEventListener(
        "dragend",
        (ev) => {
          controller.abort();
          onDragEnd?.({ data, ev });

          setDragging(false);
          clearDragGlobals();
        },
        { signal: controller.signal },
      );
    };

    return {
      draggable: true,
      onDragStart: handleDrag,
    };
  }, [data, onDragEnd, onDragMove, onDragStart, onDrop, placeholder]);

  const p =
    typeof placeholder === "function" ? (
      <ReactPlaceholder isDragging={dragging} Render={placeholder} />
    ) : null;

  return { props, isDragActive: dragging, placeholder: p };
}
