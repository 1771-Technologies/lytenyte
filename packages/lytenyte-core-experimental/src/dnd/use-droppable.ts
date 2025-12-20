import { useCallback, useMemo, useState, type DragEvent as DragEventReact } from "react";
import { clearDragGlobals, dragActiveDrop, dragData } from "./global.js";
import type { UseDroppableProps } from "./types.js";

export function useDroppable({ onExit, onEnter, onDrop, accepted, moveEffect, active }: UseDroppableProps) {
  const [over, setOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);
  const [dropEl, setDropRef] = useState<HTMLElement | null>(null);

  const handleOnExit = useCallback(
    (ev: DragEvent) => {
      setCanDrop(false);
      setOver(false);
      onExit?.({ ev, element: dropEl!, canDrop: false, data: dragData() });
    },
    [dropEl, onExit],
  );

  const handleOnEnter = useCallback(
    (ev: DragEvent) => {
      const data = dragData();
      if (!data) return;

      const keys = Object.keys(data);

      const canDrop = accepted.some((x) => keys.includes(x));
      onEnter?.({ ev, element: dropEl!, canDrop, data: dragData() });

      setCanDrop(canDrop);
      setOver(true);
    },
    [accepted, dropEl, onEnter],
  );

  const handleDrop = useCallback(
    (ev: DragEvent) => {
      setCanDrop(false);
      setOver(false);

      const data = dragData();
      if (!canDrop || !data || !dropEl) return;

      onDrop?.({ ev, canDrop: false, data, element: dropEl });
      dragActiveDrop()?.({ data, ev });
    },
    [canDrop, dropEl, onDrop],
  );

  return useMemo(() => {
    return {
      over,
      canDrop,
      eventHandlers: !active
        ? {}
        : {
            onDragEnter: (ev: DragEventReact) => {
              ev.preventDefault();
              ev.stopPropagation();
              handleOnEnter(ev.nativeEvent);
            },
            onDragLeave: (ev: DragEventReact) => {
              ev.preventDefault();
              ev.stopPropagation();
              handleOnExit(ev.nativeEvent);
            },
            onDragOver: (ev: DragEventReact) => {
              ev.preventDefault();
              if (ev.dataTransfer) ev.dataTransfer.dropEffect = moveEffect ?? "move";
            },
            onDrop: (ev: DragEventReact) => {
              handleDrop(ev.nativeEvent);
              clearDragGlobals();
            },
          },
      attrs: {
        "data-ln-drag-over": over,
        "data-ln-can-drop": canDrop,
        "data-ln-drop-zone": "true",
      },
      ref: setDropRef,
    };
  }, [active, canDrop, handleDrop, handleOnEnter, handleOnExit, moveEffect, over]);
}
