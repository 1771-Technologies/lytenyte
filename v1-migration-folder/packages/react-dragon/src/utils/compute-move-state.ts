import type { DragMoveState, DragPosition } from "../+types.js";

export function computeMoveState(
  dropEl: HTMLElement,
  dragEl: HTMLElement,
  pos: DragPosition,
): DragMoveState {
  const rect = dropEl.getBoundingClientRect();
  const x = pos.x - rect.x;
  const y = pos.y - rect.y;

  const topHalf = rect.y + rect.height / 2 > pos.y;
  const leftHalf = rect.x + rect.width / 2 > pos.x;

  return { dropElement: dropEl, dragElement: dragEl, rect, x, y, topHalf, leftHalf };
}
