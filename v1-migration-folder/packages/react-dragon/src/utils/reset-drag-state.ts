import {
  activeDragElement,
  activeDropAtom,
  dragDataAtom,
  dragKeyboardActive,
  dragKeyboardDropZone,
  dragPositionAtom,
  dropAtom,
  isTouchDragAtom,
  store,
} from "../+globals.js";

export function resetDragState() {
  store.set(dragKeyboardActive, false);
  store.set(dragKeyboardDropZone, null);
  store.set(dragDataAtom, null);
  store.set(dragPositionAtom, null);
  store.set(dropAtom, { current: null });
  store.set(activeDragElement, null);
  store.set(activeDropAtom, null);
  store.set(isTouchDragAtom, false);
}
