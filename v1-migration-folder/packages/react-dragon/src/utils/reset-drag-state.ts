import {
  activeDragElement,
  activeDropAtom,
  dragDataAtom,
  dragPositionAtom,
  dropAtom,
  isTouchDragAtom,
  store,
} from "../+globals";

export function resetDragState() {
  store.set(dragDataAtom, null);
  store.set(dragPositionAtom, null);
  store.set(dropAtom, { current: null });
  store.set(activeDragElement, null);
  store.set(activeDropAtom, null);
  store.set(isTouchDragAtom, false);
}
