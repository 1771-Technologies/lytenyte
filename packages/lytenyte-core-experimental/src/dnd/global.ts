import type { DragEventParams, UseDraggableProps } from "./types";
import { createSignal } from "./signal.js";

export const dragX = createSignal(-1);
export const dragY = createSignal(-1);
export const dragData = createSignal<UseDraggableProps["data"] | null>(null);
export const dragStyleEl = createSignal<HTMLStyleElement | null>(null);
export const dragBlankEl = createSignal<HTMLElement | null>(null);
export const dragActiveDrop = createSignal<((p: DragEventParams) => void) | null>(null);

export const clearDragGlobals = () => {
  dragX(-1);
  dragY(-1);
  dragData(null);
  dragStyleEl()?.remove();
  dragStyleEl(null);
  dragBlankEl()?.remove();
  dragBlankEl(null);
  dragActiveDrop(null);
};
