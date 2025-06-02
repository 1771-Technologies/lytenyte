import {
  forwardRef,
  useCallback,
  useState,
  type DragEvent as DragEventReact,
  type JSX,
} from "react";
import type { DragMoveState, DropWrapState, OnDropParams } from "../+types";
import { useForkRef, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useOnDragMove } from "./use-on-drag-move";
import { useDropZone } from "./use-drop-zone";
import { useRegisteredDropZone } from "./use-registered-drop-zone";

export type DropWrapProps = Omit<JSX.IntrinsicElements["div"], "onDrop"> & {
  onDrop?: (params: OnDropParams) => void;
  onDragMove?: (drag: DragMoveState) => void;
  onEnter?: () => void;
  onLeave?: () => void;

  moveEffect?: "move" | "link" | "copy" | "none";
  accepted: string[];

  as?: SlotComponent<DropWrapState>;
};

export const DropWrap = forwardRef<HTMLDivElement, DropWrapProps>(function DropWrap(
  { as, onDrop, onDragMove, onEnter, onLeave, moveEffect, accepted, ...otherProps },
  forwarded,
) {
  const [dropEl, setRef] = useState<HTMLDivElement | null>(null);

  const { over, canDrop, ...ons } = useDropZone({ dropEl, accepted, onDrop, onEnter, onLeave });

  useOnDragMove(over, dropEl, onDragMove);
  useRegisteredDropZone({ dropEl, ...ons });

  const defaultProps: JSX.IntrinsicElements["div"] = {
    onDragEnter: useCallback(
      (ev: DragEventReact) => {
        ev.preventDefault();
        ev.stopPropagation();
        ons.enter();
      },
      [ons],
    ),
    onDragLeave: useCallback(
      (ev: DragEventReact) => {
        ev.preventDefault();
        ev.stopPropagation();
        ons.leave();
      },
      [ons],
    ),
    onDragOver: useCallback(
      (ev: DragEventReact) => {
        ev.preventDefault();
        if (ev.dataTransfer) ev.dataTransfer.dropEffect = moveEffect ?? "move";
      },
      [moveEffect],
    ),
    onDrop: useCallback(() => {
      ons.drop();
    }, [ons]),
  };

  // Data properties for css targeting.
  Object.assign(defaultProps, {
    "data-drag-over": over,
    "data-drag-can-drop": canDrop,
    "data-drop-zone": "true",
  });

  const combined = useForkRef(setRef, forwarded);
  const render = useSlot({
    slot: as ?? <div />,
    props: [defaultProps, otherProps],
    ref: combined,
    state: { canDrop, over },
  });

  return render;
});
