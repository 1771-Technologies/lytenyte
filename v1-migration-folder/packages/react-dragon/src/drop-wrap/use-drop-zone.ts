import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import { useState } from "react";
import type { OnDropParams } from "../+types.js";
import { activeDragElement, dragState, dropAtom, store } from "../+globals.js";
import { computeMoveState } from "../utils/compute-move-state.js";

export interface UseDropZoneArgs {
  readonly dropEl: HTMLElement | null;
  readonly accepted: string[];
  readonly onLeave?: (el: HTMLElement) => void;
  readonly onEnter?: (el: HTMLElement) => void;
  readonly onDrop?: (params: OnDropParams) => void;
}

export function useDropZone({ dropEl, accepted, onLeave, onDrop, onEnter }: UseDropZoneArgs) {
  const [over, setOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);

  const handleLeave = useEvent((el: HTMLElement) => {
    setCanDrop(false);
    setOver(false);
    onLeave?.(el);
  });

  const handleEnter = useEvent((el: HTMLElement) => {
    const data = dragState.data.get();
    /* v8 ignore next 1 */
    if (!data) return;

    const keys = new Set(Object.keys({ ...data.dataTransfer, ...data.siteLocalData }));

    onEnter?.(el);
    setCanDrop(accepted.some((c) => keys.has(c)));
    setOver(true);
  });

  const handleDrop = useEvent(() => {
    setCanDrop(false);
    setOver(false);
    const data = dragState.data.get();
    const pos = dragState.position.get();

    if (!canDrop || !data || !dropEl || !pos) return;

    const dragEl = store.get(activeDragElement);

    const args: OnDropParams = {
      dragElement: dragEl!,
      dropElement: dropEl,
      moveState: computeMoveState(dropEl, dragEl!, pos),
      state: data,
    };

    onDrop?.(args);
    store.get(dropAtom).current?.(args);
  });

  return { over, canDrop, leave: handleLeave, enter: handleEnter, drop: handleDrop };
}
