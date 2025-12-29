import { activeDragElement, activeDropAtom, dragDataAtom, dragPositionAtom, dropAtom } from "../+globals.js";

export function resetDragState() {
  dragDataAtom.set(null);
  dragPositionAtom.set(null);
  dropAtom.set({ current: null });
  activeDragElement.set(null);
  activeDropAtom.set(null);
}
