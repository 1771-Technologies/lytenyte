import { useRef, useState, type DragEvent as ReactDragEvent } from "react";
import { dragState } from "./drag-state";
import { useEvent } from "@1771technologies/react-utils";

/** Parameters passed to drop event callbacks */
export interface DropParams {
  /** Function that returns the data associated with the dragged item */
  readonly getData: () => unknown;

  /** Tags associated with the drop target */
  readonly overTags: string[];

  /** Tags associated with the dragged item */
  readonly dragTags: string[];

  /** The native drag event */
  readonly event: DragEvent;
}

/** Configuration options for the useDroppable hook */
export interface DroppableArgs {
  /** Array of tags that identify valid drag items for this drop target */
  readonly tags: string[];

  /** Optional callback fired when a dragged item enters the drop target */
  readonly onDragEnter?: (p: DropParams) => void;

  /** Optional callback fired when a dragged item leaves the drop target */
  readonly onDragLeave?: (p: DropParams) => void;

  /** Optional callback fired when a dragged item is dropped on the target */
  readonly onDrop?: (p: DropParams) => void;
}

/**
 * React hook that implements drop target functionality with tag-based validation
 * and state management.
 *
 * @param args - Configuration options for the droppable behavior
 *
 * @returns An object containing:
 * - onDragOver: Event handler for dragover events
 * - onDrop: Event handler for drop events
 * - canDrop: Boolean indicating if the current drag item can be dropped
 * - isOver: Boolean indicating if a draggable is currently over the drop target
 *
 * @example
 * ```tsx
 * function DropZone() {
 *   const { onDragOver, onDrop, canDrop, isOver } = useDroppable({
 *     tags: ['item'],
 *     onDrop: ({ getData }) => {
 *       const droppedData = getData();
 *       console.log('Item dropped:', droppedData);
 *     }
 *   });
 *
 *   return (
 *     <div
 *       onDragOver={onDragOver}
 *       onDrop={onDrop}
 *       style={{
 *         background: isOver ? 'lightblue' : 'white',
 *         opacity: canDrop ? 1 : 0.5
 *       }}
 *     >
 *       Drop here
 *     </div>
 *   );
 * }
 * ```
 */
export function useDroppable({ tags, onDragEnter, onDragLeave, onDrop }: DroppableArgs) {
  const [isOver, setIsOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);
  const immediateOver = useRef(false);

  const onDragOver = useEvent((event: ReactDragEvent) => {
    if (!dragState.dragActive.peek()) return;

    event.stopPropagation();

    if (hasTags(tags)) {
      event.preventDefault();
      setCanDrop(true);
    } else {
      setCanDrop(false);
    }

    if (immediateOver.current) return;

    const element = event.currentTarget as HTMLElement;

    const handleEnd = (event: DragEvent) => {
      setIsOver(() => {
        immediateOver.current = false;
        controller.abort();

        onDragLeave?.({
          getData: dragState.dragData.peek(),
          event,
          overTags: tags,
          dragTags: dragState.activeTags.peek()!,
        });

        return false;
      });

      setCanDrop(false);
    };

    const controller = new AbortController();
    element.addEventListener("dragleave", handleEnd, { signal: controller.signal });
    window.addEventListener("dragend", handleEnd, { signal: controller.signal });
    window.addEventListener(
      "drop",
      () => {
        setIsOver(false);
        setCanDrop(false);
      },
      { signal: controller.signal, capture: true },
    );

    onDragEnter?.({
      getData: dragState.dragData.peek(),
      event: event.nativeEvent,
      overTags: tags,
      dragTags: dragState.activeTags.peek() ?? [],
    });
    immediateOver.current = true;
    setIsOver(true);
  });

  const handleDrop = useEvent((event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!hasTags(tags)) return;

    onDrop?.({
      getData: dragState.dragData.peek(),
      event,
      overTags: tags,
      dragTags: dragState.activeTags.peek()!,
    });

    dragState.dragData.set(() => () => null);

    return;
  });

  return {
    onDragOver,
    onDrop: handleDrop,
    canDrop,
    isOver,
  };
}

/**
 * Checks if the currently dragged item has at least one tag that matches
 * the allowed tags of the drop target.
 *
 * @param allowedTags - Array of tags that identify valid drag items
 * @returns True if there is at least one matching tag, false otherwise
 * @private
 */
function hasTags(allowedTags: string[]) {
  const tags = dragState.activeTags.peek() ?? [];

  return tags.some((c) => allowedTags.includes(c));
}
