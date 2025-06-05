/* eslint-disable react-hooks/rules-of-hooks */
import type { DragPosition, DropZone, InCurrent, OnDropParams } from "./+types";
import { type DragData } from "./+types";
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

export const dragState = {
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
