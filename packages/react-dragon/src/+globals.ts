import { makeAtom, signal } from "@1771technologies/lytenyte-signal";
import type { DragPosition, InCurrent, OnDropParams } from "./+types.js";
import { type DragData } from "./+types.js";

export const dragDataAtom = signal<DragData | null>(null);
export const dropAtom = signal<InCurrent<((params: OnDropParams) => void) | null>>({
  current: null,
});

export const dragPositionAtom = signal<DragPosition | null>(null);
export const activeDragElement = signal<HTMLElement | null>(null);
export const activeDropAtom = signal<HTMLElement | null>(null);
export const dragStyleEl = signal<HTMLStyleElement | null>(null);
export const placeholderEle = signal<HTMLElement | null>(null);

export const placeholderHandler = {
  clean: () => {
    placeholderEle()?.remove();
  },
  set: (el: HTMLElement | null) => {
    placeholderEle.set(el);
  },
};

export const dragStyleHandler = {
  clean: () => {
    dragStyleEl()?.remove();
  },
  set: (el: HTMLStyleElement | null) => {
    dragStyleEl.set(el);
  },
};

export const dragState = {
  active: makeAtom(activeDragElement),
  over: makeAtom(activeDropAtom),
  data: makeAtom(dragDataAtom),
  position: makeAtom(dragPositionAtom),
};
