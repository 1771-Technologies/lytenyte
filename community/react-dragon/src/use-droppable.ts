import { useRef, useState, type DragEvent as ReactDragEvent } from "react";
import { dragState } from "./drag-state";
import { useEvent } from "@1771technologies/react-utils";

export interface DropParams {
  readonly getData: () => unknown;
  readonly overTags: string[];
  readonly dragTags: string[];
  readonly event: DragEvent;
}

export interface DroppableArgs {
  readonly tags: string[];

  readonly onDragEnter?: (p: DropParams) => void;
  readonly onDragLeave?: (p: DropParams) => void;
  readonly onDrop?: (p: DropParams) => void;
}

export function useDroppable({ tags, onDragEnter, onDragLeave, onDrop }: DroppableArgs) {
  const [isOver, setIsOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);
  const immediateOver = useRef(false);

  const onDragOver = useEvent((event: ReactDragEvent) => {
    if (!dragState.store.dragActive.peek()) return;

    event.stopPropagation();

    if (hasTags(tags)) {
      event.preventDefault();
      setCanDrop(true);
    } else setCanDrop(false);

    if (immediateOver.current) return;

    const element = event.currentTarget as HTMLElement;

    const handleEnd = (event: DragEvent) => {
      setIsOver(() => {
        immediateOver.current = false;
        controller.abort();

        onDragLeave?.({
          getData: dragState.store.dragData.peek(),
          event,
          overTags: tags,
          dragTags: dragState.store.activeTags.peek() ?? [],
        });

        return false;
      });
    };

    const controller = new AbortController();
    element.addEventListener("dragleave", handleEnd, { signal: controller.signal });
    document.addEventListener("dragend", handleEnd, { signal: controller.signal });

    onDragEnter?.({
      getData: dragState.store.dragData.peek(),
      event: event.nativeEvent,
      overTags: tags,
      dragTags: dragState.store.activeTags.peek() ?? [],
    });
    immediateOver.current = true;
    setIsOver(true);
  });

  const handleDrop = useEvent((event) => {
    event.preventDefault();
    if (!hasTags(tags)) return;

    onDrop?.({
      getData: dragState.store.dragData.peek(),
      event,
      overTags: tags,
      dragTags: dragState.store.activeTags.peek() ?? [],
    });

    return;
  });

  return {
    onDragOver,
    onDrop: handleDrop,
    canDrop,
    isOver,
  };
}

function hasTags(allowedTags: string[]) {
  const tags = dragState.store.activeTags.peek() ?? [];

  return tags.some((c) => allowedTags.includes(c));
}
