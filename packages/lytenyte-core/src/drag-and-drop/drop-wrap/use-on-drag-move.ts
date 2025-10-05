import { useEffect, useState } from "react";
import type { DragMoveState } from "../+types.js";
import { activeDragElement, dragState } from "../+globals.js";
import { computeMoveState } from "../utils/compute-move-state.js";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import { peek } from "@1771technologies/lytenyte-signal";

export function useOnDragMove(
  over: boolean,
  dropEl: HTMLElement | null,
  onDragMove?: (param: DragMoveState) => void,
) {
  const dragMove = useEvent(onDragMove ?? (() => {}));

  const [isTopHalf, setIsTopHalf] = useState(false);
  const [isLeftHalf, setIsLeftHalf] = useState(false);

  useEffect(() => {
    if (!over) return;

    const remove = dragState.position.watch(() => {
      const pos = dragState.position.get();
      const dragEl = peek(activeDragElement);

      if (!dropEl || !pos || !dragEl) return;
      const s = computeMoveState(dropEl, dragEl, pos);

      setIsTopHalf(s.topHalf);
      setIsLeftHalf(s.leftHalf);

      dragMove(s);
    });

    return () => remove();
  }, [over, dropEl, dragMove]);

  return { isTopHalf, isLeftHalf };
}
