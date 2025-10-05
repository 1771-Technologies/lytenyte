import { useMemo, useState, type DragEventHandler } from "react";
import type { DragData, OnDragEvent, OnDropParams } from "./+types.js";
import { useDragEventHandler } from "./drag/use-dragevent-handler.js";

export interface UseDraggableProps {
  readonly getItems: (el: HTMLElement) => DragData;

  readonly onDragMove?: (params: OnDragEvent) => void;
  readonly onDragStart?: (params: OnDragEvent) => void;
  readonly onDragEnd?: (params: OnDragEvent) => void;
  readonly onDrop?: (params: OnDropParams) => void;

  readonly placeholder?: (d: DragData, el: HTMLElement) => HTMLElement;
  readonly placeholderOffset?: [number, number];
}

export interface DragProps {
  readonly onDragStart: DragEventHandler;
  readonly draggable: boolean;
  readonly ref: any;
}

export function useDraggable(p: UseDraggableProps): { dragProps: DragProps; isDragging: boolean } {
  const [isDragging, setDragging] = useState(false);

  const handleDragStart = useDragEventHandler(p, setDragging);

  const [_, ref] = useState<HTMLElement | null>(null);

  const dragProps = useMemo(() => {
    return {
      onDragStart: handleDragStart,
      draggable: true,
      tabIndex: 0,
      role: "button",
      ref,
    };
  }, [handleDragStart]);

  return { dragProps, isDragging };
}
