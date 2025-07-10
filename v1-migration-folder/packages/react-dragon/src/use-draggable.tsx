import { useEffect, useId, useMemo, useState, type DragEventHandler, type ReactNode } from "react";
import type { DragData, OnDragEvent, OnDropParams } from "./+types.js";
import { useDragEventHandler } from "./drag/use-dragevent-handler.js";
import { useTouchHandler } from "./touch/use-touch-handler.js";
import { useKeyboard } from "./keyboard/use-keyboard.js";
import { announce } from "@1771technologies/lytenyte-dom-utils";

export interface UseDraggableProps {
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

  readonly dragInstructions?: string;
  readonly announceDragStart?: string;
  readonly announceDragEnd?: string;
}

export interface DragProps {
  readonly onDragStart: DragEventHandler;
  readonly draggable: boolean;
  readonly ref: any;
}

export function useDraggable(p: UseDraggableProps): { dragProps: DragProps; isDragging: boolean } {
  const [isDragging, setDragging] = useState(false);

  const [draggable, ref] = useState<HTMLElement | null>(null);

  const handleDragStart = useDragEventHandler(p, setDragging);

  const id = useId();
  useEffect(() => {
    if (!draggable) return;

    const defaultInstructions = `Click to start dragging. Drag may also be activated by pressing the ${p.keyActivate ?? "Enter"} key. 
      When activated by the keyboard, use the ${p.keyNext ?? "ArrowRight"} and ${p.keyPrev ?? "ArrowLeft"} keys to cycle through drop-zones. 
      Finally press the ${p.keyDrop ?? "Enter"} to drop the item on a drop zone or the Escape key to cancel.`;

    const element = document.createElement("div");
    element.id = id;
    element.style.display = "none";
    element.textContent = p.dragInstructions ?? defaultInstructions;
    document.body.append(element);

    return () => element.remove();
  }, [draggable, id, p.dragInstructions, p.keyActivate, p.keyDrop, p.keyNext, p.keyPrev]);

  useEffect(() => {
    if (!isDragging) return;

    announce(p.announceDragStart ?? "Item drag has begun");

    return () => {
      /* v8 ignore next 3 */
      if (isDragging) return;
      announce(p.announceDragEnd ?? "Item drag has ended");
    };
  }, [isDragging, p.announceDragEnd, p.announceDragStart]);

  useTouchHandler(p, setDragging, draggable);

  const onKeyDown = useKeyboard(setDragging, p);

  const dragProps = useMemo(() => {
    return {
      onDragStart: handleDragStart,
      onKeyDown,
      draggable: true,
      tabIndex: 0,
      role: "button",
      "aria-describedby": id,
      ref,
    };
  }, [handleDragStart, id, onKeyDown]);

  return { dragProps, isDragging };
}
