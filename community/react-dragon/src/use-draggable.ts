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
    // If the drag is disabled, we don't want to do anything, hence we prevent
    // if from even happening.
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // If the user has a placeholder element that we should create it and use it. The placeholder
    // get's rendered using React's render to string function, hence it is a separate react context
    // with separate states.
    let img: HTMLElement | null = null;
    if (placeholder) {
      img = dragPlaceholder(placeholder);
      document.body.appendChild(img);
      e.dataTransfer.setDragImage(img, 0, 0);
    }

    // We set the drag effects to prevent the cursor from showing a plus icon. Unfortunately we
    // cannot override the cursor whilst dragging.
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.dropEffect = "move";

    // Grab the drag tags for this drag. We set our initial drag state here.
    const tags = dragTags();
    dragState.store.activeTags.set(tags);
    dragState.store.dragActive.set(true);
    dragState.store.dragData.set(() => dragData);

    onDragStart?.({ tags, event: e.nativeEvent });

    const controller = new AbortController();
    let anim: number | null = null;

    // If the user has provided a drag move function, we enable cursor tracking. We do
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
            // We only track drag moves within its own view. It's possible for a drag to start in
            // an iframe. In this case the clientX and clientY will not be correct if the drag is
            // moved outside the frame. There isn't a clear reason for allowing two sets of client
            // coordinates to be reported. If we do encounter a situation where this may be desirable
            // we can remove this condition. But that should definitely be considered a breaking change
            if (ev.view?.window !== window) return;

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

        // If the drag ended but it wasn't dropped, we consider it cancelled.
        const isValid = event.dataTransfer?.dropEffect !== "none";
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
  });

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
}
