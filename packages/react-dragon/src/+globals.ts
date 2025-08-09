/* eslint-disable react-hooks/rules-of-hooks */
import type { DragPosition, DropZone, InCurrent, OnDropParams } from "./+types.js";
import { type DragData } from "./+types.js";
import { createStore, atom, useAtomValue } from "@1771technologies/atom";

export const store = createStore();

export const dragKeyboardActive = atom(false);
export const dragKeyboardDropZone = atom<HTMLElement | null>(null);

export const dragDataAtom = atom<DragData | null>(null);
export const dropAtom = atom<InCurrent<((params: OnDropParams) => void) | null>>({ current: null });

export const dragPositionAtom = atom<DragPosition | null>(null);
export const activeDragElement = atom<HTMLElement | null>(null);
export const activeDropAtom = atom<HTMLElement | null>(null);
export const isTouchDragAtom = atom(false);
export const dropZonesAtom = new Map<HTMLElement, DropZone>();

export const dragStyleEl = atom<HTMLStyleElement | null>(null);
export const placeholderEle = atom<HTMLElement | null>(null);

export const placeholderHandler = {
  clean: () => {
    store.get(placeholderEle)?.remove();
  },
  set: (el: HTMLElement | null) => {
    store.set(placeholderEle, el);
  },
};

export const dragStyleHandler = {
  clean: () => {
    store.get(dragStyleEl)?.remove();
  },
  set: (el: HTMLStyleElement | null) => {
    store.set(dragStyleEl, el);
  },
};

export const dragState = {
  active: {
    get: () => store.get(activeDragElement),
    watch: (fn: () => void) => store.sub(activeDragElement, fn),
    use: () => useAtomValue(activeDragElement, { store }),
  },
  over: {
    get: () => store.get(activeDropAtom),
    watch: (fn: () => void) => store.sub(activeDropAtom, fn),
    use: () => useAtomValue(activeDropAtom, { store }),
  },
  data: {
    get: () => store.get(dragDataAtom),
    watch: (fn: () => void) => store.sub(dragDataAtom, fn),
    use: () => useAtomValue(dragDataAtom, { store }),
  },
  position: {
    get: () => store.get(dragPositionAtom),
    watch: (fn: () => void) => store.sub(dragPositionAtom, fn),
    use: () => useAtomValue(dragPositionAtom, { store }),
  },
};
