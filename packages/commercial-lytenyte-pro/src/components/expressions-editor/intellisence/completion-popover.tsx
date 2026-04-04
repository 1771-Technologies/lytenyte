import { useRef, useEffect, type JSX, forwardRef } from "react";
import { useCompletionPopover } from "./completion-context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";

function CompletionPopoverImpl(
  { children, ...props }: JSX.IntrinsicElements["div"],
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const { isOpen, coordinates } = useCompletionPopover();

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;

    if (isOpen) {
      if (!el.matches(":popover-open")) el.showPopover();
    } else {
      if (el.matches(":popover-open")) el.hidePopover();
    }
  }, [isOpen]);

  const combined = useCombinedRefs(ref, popoverRef);

  return (
    <div
      {...props}
      ref={combined}
      popover="manual"
      data-ln-expression-popover
      style={{
        position: "fixed",
        top: coordinates.top + coordinates.lineHeight,
        left: coordinates.left,
        margin: 0,
        inset: "unset",
      }}
    >
      {isOpen ? children : null}
    </div>
  );
}

export const CompletionPopover = forwardRef(CompletionPopoverImpl);
