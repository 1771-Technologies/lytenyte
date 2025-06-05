import { useMemo, useState, type DragEventHandler, type ReactNode } from "react";
import type { DragData, OnDragEvent, OnDropParams } from "./+types";
import { useDragEventHandler } from "./drag/use-dragevent-handler";
import { useTouchHandler } from "./touch/use-touch-handler";
import { useKeyboard } from "./keyboard/use-keyboard";

export interface UseDraggable {
  readonly getItems: (el: HTMLElement) => DragData;

  readonly onDragMove?: (params: OnDragEvent) => void;
  readonly onDragStart?: (params: OnDragEvent) => void;
  readonly onDragEnd?: (params: OnDragEvent) => void;
  readonly onDrop?: (params: OnDropParams) => void;

  readonly placeholder?: (d: DragData) => ReactNode;
  readonly placeholderOffset?: [number, number];

  readonly keyActivate?: string;
  readonly keyNext?: string;
  readonly keyPrev?: string;
  readonly keyDrop?: string;
}

export interface DragProps {
  readonly onDragStart: DragEventHandler;
  readonly draggable: boolean;
  readonly ref: any;
}

export function useDraggable(props: UseDraggable): { dragProps: DragProps; isDragging: boolean } {
  const [isDragging, setDragging] = useState(false);

  const [draggable, ref] = useState<HTMLElement | null>(null);

  const handleDragStart = useDragEventHandler(props, setDragging);

  useTouchHandler(props, setDragging, draggable);

  const onKeyDown = useKeyboard(setDragging, props);

  const dragProps = useMemo(() => {
    return {
      onDragStart: handleDragStart,
      onKeyDown,
      draggable: true,
      tabIndex: 0,
      ref,
    };
  }, [handleDragStart, onKeyDown]);

  return { dragProps, isDragging };
}
