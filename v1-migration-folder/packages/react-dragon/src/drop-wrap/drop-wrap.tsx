import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type DragEvent as DragEventReact,
  type JSX,
} from "react";
import type { DragMoveState, DropWrapState, OnDropParams } from "../+types.js";
import { useForkRef, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useOnDragMove } from "./use-on-drag-move.js";
import { useDropZone } from "./use-drop-zone.js";
import { useRegisteredDropZone } from "./use-registered-drop-zone.js";
import { announce } from "@1771technologies/lytenyte-dom-utils";

export type DropWrapProps = Omit<JSX.IntrinsicElements["div"], "onDrop"> & {
  onDrop?: (params: OnDropParams) => void;
  onDragMove?: (drag: DragMoveState) => void;
  onEnter?: () => void;
  onLeave?: () => void;

  moveEffect?: "move" | "link" | "copy" | "none";
  accepted: string[];

  as?: SlotComponent<DropWrapState>;

  announceOverNoDrop?: string;
  announceOverCanDrop?: string;
  announceOverLeave?: string;
};

export const DropWrap = forwardRef<HTMLDivElement, DropWrapProps>(function DropWrap(
  {
    as,
    onDrop,
    onDragMove,
    onEnter,
    onLeave,
    moveEffect,
    accepted,
    announceOverCanDrop,
    announceOverLeave,
    announceOverNoDrop,
    ...otherProps
  },
  forwarded,
) {
  const [dropEl, setRef] = useState<HTMLDivElement | null>(null);

  const { over, canDrop, ...ons } = useDropZone({ dropEl, accepted, onDrop, onEnter, onLeave });

  useOnDragMove(over, dropEl, onDragMove);
  useRegisteredDropZone({ dropEl, ...ons });

  useEffect(() => {
    if (!over) return;

    if (canDrop) announce(announceOverCanDrop ?? "Over an item that accepts the current drag");
    else announce(announceOverNoDrop ?? "Over an item that does not accept the current drag");

    return () => {
      if (canDrop) return;
      announce(announceOverLeave ?? "Drag has left the item");
    };
  }, [announceOverCanDrop, announceOverLeave, announceOverNoDrop, canDrop, over]);

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
