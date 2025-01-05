import { useEvent } from "@1771technologies/react-utils";
import { type DragEvent as ReactDragEvent, type ReactNode } from "react";
import { dragPlaceholder } from "./drag-placeholder";
import { dragState } from "./drag-state";
import { getClientX, getClientY } from "@1771technologies/js-utils";

export type DragEventParams = {
  readonly tags: string[];
  readonly event: DragEvent;
};

export type DragMoveParams = {
  readonly clientY: number;
  readonly clientX: number;
} & DragEventParams;

export interface UseDraggableArgs {
  readonly dragData: () => unknown;
  readonly dragTags: () => string[];
  readonly placeholder?: () => ReactNode;

  readonly onDragStart?: (args: DragEventParams) => void;
  readonly onDragCancel?: (args: DragEventParams) => void;
  readonly onDragEnd?: (args: DragEventParams) => void;
  readonly onDragMove?: (args: DragMoveParams) => void;
  readonly disabled?: boolean;
}

export function useDraggable({
  dragData,
  dragTags,
  placeholder,
  disabled,
  onDragCancel,
  onDragEnd,
  onDragStart,
  onDragMove,
}: UseDraggableArgs) {
  const handleDragStart = useEvent((e: ReactDragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    let img: HTMLElement | null = null;
    if (placeholder) {
      img = dragPlaceholder(placeholder);
      document.body.appendChild(img);

      e.dataTransfer.setDragImage(img, 0, 0);
    }

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.dropEffect = "move";

    const tags = dragTags();
    dragState.store.activeTags.set(tags);
    dragState.store.dragActive.set(true);
    dragState.store.dragData.set(dragData);

    onDragStart?.({ tags, event: e.nativeEvent });

    const controller = new AbortController();

    let anim: number | null = null;
    if (onDragMove) {
      const startX = getClientX(e.nativeEvent);
      const startY = getClientY(e.nativeEvent);
      const updatesX = [startX, startX] as [number, number];
      const updatesY = [startY, startY] as [number, number];
      const updatePosition = (u: [number, number], next: number) => {
        u[0] = u[1];
        u[1] = next;
      };

      document.addEventListener(
        "drag",
        (ev) => {
          const clientX = getClientX(ev);
          const clientY = getClientY(ev);
          updatePosition(updatesX, clientX);
          updatePosition(updatesY, clientY);
          const x = updatesX[0];
          const y = updatesY[0];

          // Drag events always fire (WHY ???). So we need to detect an actual move. We do that
          // by comparing the previous and next position. If they are the same the user hasn't
          // moved their cursor.
          if (x === updatesX[1] && y === updatesY[1]) return;

          // Since the drag events fire at an extremely high rate, we rate limit to the frame rate.
          // It doesn't really make sense to fire faster than this.
          if (anim) cancelAnimationFrame(anim);
          anim = requestAnimationFrame(() => {
            onDragMove({ clientX: x, clientY: y, event: ev, tags });
          });
        },
        { signal: controller.signal },
      );
    }

    window.addEventListener(
      "dragend",
      (event) => {
        controller.abort();
        img?.remove();

        if (anim) cancelAnimationFrame(anim);

        const isValid = event.dataTransfer?.dropEffect === "move";
        if (!isValid) {
          onDragCancel?.({ event, tags });
        } else {
          onDragEnd?.({ event, tags });
        }

        dragState.store.activeTags.set(null);
        dragState.store.dragActive.set(false);
        dragState.store.dragData.set(() => () => null);
        dragState.store.overTags.set(null);
      },
      { signal: controller.signal },
    );

    // We need to begin the drag. First step is the drag image handling
  });

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
}
