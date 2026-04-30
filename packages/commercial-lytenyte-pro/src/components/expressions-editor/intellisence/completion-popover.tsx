import { useRef, useEffect, type JSX, forwardRef } from "react";
import { useCompletionPopover } from "./completion-context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";
import { autoUpdate, computePosition, offset, shift } from "../../external/floating-ui.js";

function CompletionPopoverImpl(
  { children, ...props }: JSX.IntrinsicElements["div"],
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const { isOpen, referenceElement } = useCompletionPopover();

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

  useEffect(() => {
    const el = popoverRef.current;
    if (!isOpen || !el || !referenceElement) return;

    function update() {
      computePosition(referenceElement!, el!, {
        strategy: "fixed",
        placement: "bottom-start",
        middleware: [offset(4), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        el!.style.left = `${x}px`;
        el!.style.top = `${y}px`;
      });
    }

    return autoUpdate(referenceElement, el, update);
  }, [isOpen, referenceElement]);

  const combined = useCombinedRefs(ref, popoverRef);

  return (
    <div
      {...props}
      ref={combined}
      popover="manual"
      data-ln-expression-popover
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        inset: "unset",
      }}
    >
      {isOpen ? children : null}
    </div>
  );
}

export const CompletionPopover = forwardRef(CompletionPopoverImpl);
