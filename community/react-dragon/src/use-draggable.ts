import { useEvent } from "@1771technologies/react-utils";
import type { DragEvent as ReactDragEvent, ReactNode } from "react";
import { dragPlaceholder } from "./drag-placeholder";
import { dragState } from "./drag-state";
import { getClientX, getClientY } from "@1771technologies/js-utils";

/** Parameters passed to drag event callbacks */
export type DragEventParams = {
  readonly tags: string[];
  readonly event: DragEvent;
};

/** Parameters passed to drag move callback */
export type DragMoveParams = {
  readonly clientY: number;
  readonly clientX: number;
} & DragEventParams;

/**
 * Configuration options for the useDraggable hook
 */
export interface UseDraggableArgs {
  /** Function that returns the data to be associated with the drag operation */
  readonly dragData: () => unknown;

  /** Function that returns an array of tags identifying the dragged content */
  readonly dragTags: () => string[];

  /** Optional function that returns a React node to use as a custom drag image */
  readonly placeholder?: () => ReactNode;

  /** Optional callback fired when drag operation starts */
  readonly onDragStart?: (args: DragEventParams) => void;

  /** Optional callback fired when drag operation is cancelled */
  readonly onDragCancel?: (args: DragEventParams) => void;

  /** Optional callback fired when drag operation ends successfully */
  readonly onDragEnd?: (args: DragEventParams) => void;

  /** Optional callback fired during drag movement */
  readonly onDragMove?: (args: DragMoveParams) => void;

  /** Optional flag to disable drag functionality */
  readonly disabled?: boolean;
}

/**
 * React hook that implements drag functionality with enhanced features like custom drag images,
 * movement tracking, and state management.
 *
 * @param args - Configuration options for the draggable behavior
 *
 * @returns An object containing:
 * - draggable: boolean indicating element can be dragged
 * - onDragStart: Event handler to be attached to draggable element
 *
 * @example
 * ```tsx
 * function DraggableItem({ data }) {
 *   const { draggable, onDragStart } = useDraggable({
 *     dragData: () => data,
 *     dragTags: () => ['item'],
 *     onDragStart: ({ tags }) => console.log('Started dragging:', tags)
 *   });
 *
 *   return (
 *     <div draggable={draggable} onDragStart={onDragStart}>
 *       Drag me
 *     </div>
 *   );
 * }
 * ```
 */
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
    dragState.activeTags.set(tags);
    dragState.dragActive.set(true);
    dragState.dragData.set(() => dragData);

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
          /* v8 ignore next */
          if (anim) cancelAnimationFrame(anim);
          anim = requestAnimationFrame(() => {
            // We only track drag moves within its own view. It's possible for a drag to start in
            // an iframe. In this case the clientX and clientY will not be correct if the drag is
            // moved outside the frame. There isn't a clear reason for allowing two sets of client
            // coordinates to be reported. If we do encounter a situation where this may be desirable
            // we can remove this condition. But that should definitely be considered a breaking change
            /* v8 ignore next */
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

        const isValid = event.dataTransfer?.dropEffect !== "none";
        if (!isValid) {
          onDragCancel?.({ event, tags });
        } else {
          onDragEnd?.({ event, tags });
        }

        dragState.activeTags.set(null);
        dragState.dragActive.set(false);
        dragState.dragData.set(() => () => null);
        dragState.overTags.set(null);
      },
      { signal: controller.signal },
    );
  });

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
}
