import {
  forwardRef,
  useCallback,
  useState,
  type DragEvent as DragEventReact,
  type JSX,
} from "react";
import type { DragMoveState, DropWrapState, OnDropParams } from "../+types.js";
import { useOnDragMove } from "./use-on-drag-move.js";
import { useDropZone } from "./use-drop-zone.js";
import { dragStyleHandler, placeholderHandler } from "../+globals.js";
import {
  useCombinedRefs,
  useSlot,
  type SlotComponent,
} from "@1771technologies/lytenyte-hooks-react";

export type DropWrapProps = Omit<JSX.IntrinsicElements["div"], "onDrop"> & {
  onDrop?: (params: OnDropParams) => void;
  onDragMove?: (drag: DragMoveState) => void;
  onEnter?: (el: HTMLElement) => void;
  onLeave?: (el: HTMLElement) => void;

  moveEffect?: "move" | "link" | "copy" | "none";
  accepted: string[];

  as?: SlotComponent<DropWrapState>;

  active?: boolean;
};

export const DropWrap = forwardRef<HTMLDivElement, DropWrapProps>(function DropWrap(
  { as, onDrop, onDragMove, onEnter, onLeave, moveEffect, accepted, active, ...otherProps },
  forwarded,
) {
  const [dropEl, setRef] = useState<HTMLDivElement | null>(null);

  const { over, canDrop, ...ons } = useDropZone({ dropEl, accepted, onDrop, onEnter, onLeave });

  const { isLeftHalf, isTopHalf } = useOnDragMove(over, dropEl, onDragMove);

  const defaultProps: JSX.IntrinsicElements["div"] = {
    onDragEnter: useCallback(
      (ev: DragEventReact) => {
        ev.preventDefault();
        ev.stopPropagation();
        ons.enter(dropEl!);
      },
      [dropEl, ons],
    ),
    onDragLeave: useCallback(
      (ev: DragEventReact) => {
        ev.preventDefault();
        ev.stopPropagation();
        ons.leave(dropEl!);
      },
      [dropEl, ons],
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
      placeholderHandler.clean();
      dragStyleHandler.clean();
    }, [ons]),
  };

  // Data properties for css targeting.
  Object.assign(defaultProps, {
    "data-ln-drag-over": over,
    "data-ln-can-drop": canDrop,
    "data-ln-drop-zone": "true",
    "data-ln-over-top-half": isTopHalf,
    "data-ln-over-left-half": isLeftHalf,
  });

  const combined = useCombinedRefs(setRef, forwarded);
  const render = useSlot({
    slot: as ?? <div />,
    props: [active === false ? {} : defaultProps, otherProps],
    ref: combined,
    state: { canDrop, over },
  });

  return render;
});
